import React from "react";
import { Menu } from "./menu";
import { NavMenu } from "./navMenu";
import { Footer } from "./footer";
import { Container } from "reactstrap";

export const Layout = ({ children }) => {
  return (
    <>
      <Menu />
      <div style={{ display: "flex", flexFlow: "row" }}>
        <NavMenu />
        <div style={{ flexGrow: 1, display: "flex", flexFlow: "column" }}>
          <div style={{ flexGrow: 1 }}>
            <Container style={{ height: "100%", padding: 50 }}>{children}</Container>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};
