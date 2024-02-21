import React, { useEffect, useState } from "react";
import "./NavMenu.css";
import { NavLink } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import authService from "../../api-authorization/AuthorizeService";

export const NavMenu = () => {
  const { pathname } = useLocation();
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const populateState = async () => {
      const user = await authService.getUser();

      setUser(user);
    };

    var subscription = authService.subscribe(() => populateState());
    populateState();

    return () => {
      authService.unsubscribe(subscription);
    };
  }, []);

  if (!user) {
    return <aside></aside>;
  }

  return (
    <aside>
      {user.role === "RH" ? (
        <>
          <NavLink tag={Link} className="text-light" to={"/positions"} active={pathname.includes("positions")}>
            Posiciones
          </NavLink>
          <NavLink tag={Link} className="text-light" to={"/candidates"} active={pathname.includes("candidates")}>
            Candidatos
          </NavLink>
          <NavLink replace tag={Link} className="text-light" to={"/employees"} active={pathname.includes("employees")}>
            Empleados
          </NavLink>
          <NavLink
            replace
            tag={Link}
            className="text-light"
            to={"/departments"}
            active={pathname.includes("departments")}
          >
            Departamentos
          </NavLink>
          <NavLink replace tag={Link} className="text-light" to={"/languages"} active={pathname.includes("languages")}>
            Idiomas
          </NavLink>
        </>
      ) : (
        <NavLink replace tag={Link} className="text-light" to={"/employees"} active={pathname.includes("employees")}>
          Empleados
        </NavLink>
      )}
    </aside>
  );
};
