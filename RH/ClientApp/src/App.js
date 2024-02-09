import React from "react";
import { Layout } from "./components/layout/Layout";
import { Route, Routes } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import AuthorizeRoute from "./components/api-authorization/AuthorizeRoute";
import "./custom.css";

export const App = () => {
  return (
    <Layout>
      <Routes>
        {AppRoutes.map((route, index) => {
          const { element, requireAuth, ...rest } = route;
          return (
            <Route
              key={index}
              {...rest}
              element={requireAuth ? <AuthorizeRoute {...rest} element={element} /> : element}
            />
          );
        })}
      </Routes>
    </Layout>
  );
};

// export default class App extends Component {
//   static displayName = App.name;

//   render() {
//     return (
//       <Layout>
//         <Routes>
//           {AppRoutes.map((route, index) => {
//             const { element, requireAuth, ...rest } = route;
//             return <Route key={index} {...rest} element={requireAuth ? <AuthorizeRoute {...rest} element={element} /> : element} />;
//           })}
//         </Routes>
//       </Layout>
//     );
//   }
// }
