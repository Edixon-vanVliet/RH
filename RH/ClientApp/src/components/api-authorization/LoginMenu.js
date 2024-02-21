import React, { Fragment, useEffect, useState } from "react";
import { NavLink, Navbar } from "reactstrap";
import { Link } from "react-router-dom";
import authService from "./AuthorizeService";
import { ApplicationPaths } from "./ApiAuthorizationConstants";
import "./LoginMenu.css";

export const LoginMenu = () => {
  const [state, setState] = useState({
    isAuthenticated: false,
    userName: null,
  });

  useEffect(() => {
    const populateState = async () => {
      const [isAuthenticated, user] = await Promise.all([authService.isAuthenticated(), authService.getUser()]);

      setState({
        isAuthenticated,
        userName: user && user.name,
      });
    };

    var subscription = authService.subscribe(() => populateState());
    populateState();

    return () => {
      authService.unsubscribe(subscription);
    };
  }, []);

  if (!state.isAuthenticated) {
    return anonymousView(ApplicationPaths.Login);
  }

  return authenticatedView(state.userName, ApplicationPaths.Profile, ApplicationPaths.LogOut, { local: true });
};

const anonymousView = (loginPath) => (
  <Fragment>
    <Navbar className="anonymousNav">
      <NavLink tag={Link} className="text-light" to={loginPath}>
        Login
      </NavLink>
    </Navbar>
  </Fragment>
);

const authenticatedView = (userName, profilePath, logoutPath, logoutState) => (
  <Fragment>
    <Navbar className="authenticatedNav">
      <NavLink tag={Link} className="text-light" to={profilePath}>
        Hola {userName}
      </NavLink>
      <NavLink replace tag={Link} className="text-light" to={logoutPath} state={logoutState}>
        Logout
      </NavLink>
    </Navbar>
  </Fragment>
);
