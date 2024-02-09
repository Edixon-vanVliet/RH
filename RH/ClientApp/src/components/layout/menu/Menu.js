import React from "react";
import "./Menu.css";
import { LoginMenu } from "../../api-authorization/LoginMenu";
import { Link } from "react-router-dom";
import { NavLink } from "reactstrap";

export const Menu = () => {
  return (
    <header>
      <div>
        <h1>
          <NavLink tag={Link} className="text-light" to={"/"}>
            RH
          </NavLink>
        </h1>
        {/* <LoginMenu /> */}
      </div>
    </header>
  );
};
