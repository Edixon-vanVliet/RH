import React from "react";
import "./NavMenu.css";
import { NavLink } from "reactstrap";
import { Link, useLocation } from "react-router-dom";

export const NavMenu = () => {
  const { pathname } = useLocation();
  return (
    <aside>
      <NavLink tag={Link} className="text-light" to={"/positions"} active={pathname.includes("positions")}>
        Posiciones
      </NavLink>
      <NavLink tag={Link} className="text-light" to={"/candidates"} active={pathname.includes("candidates")}>
        Candidatos
      </NavLink>
      <NavLink replace tag={Link} className="text-light" to={"/employees"} active={pathname.includes("employees")}>
        Empleados
      </NavLink>
      <NavLink replace tag={Link} className="text-light" to={"/departments"} active={pathname.includes("departments")}>
        Departamentos
      </NavLink>
      <NavLink replace tag={Link} className="text-light" to={"/languages"} active={pathname.includes("languages")}>
        Idiomas
      </NavLink>
    </aside>
  );
};
