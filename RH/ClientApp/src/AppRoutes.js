import ApiAuthorzationRoutes from "./components/api-authorization/ApiAuthorizationRoutes";
import { Home } from "./pages/home";
import { Candidates } from "./pages/candidates";
import { Positions } from "./pages/positions";
import { Employees } from "./pages/employees";
import { Departments } from "./pages/departments/Departments";
import { Languages } from "./pages/languages";

const AppRoutes = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: "/positions",
    // requireAuth: true,
    element: <Positions />,
  },
  {
    path: "/candidates",
    // requireAuth: true,
    element: <Candidates />,
  },
  {
    path: "/employees",
    // requireAuth: true,
    element: <Employees />,
  },
  {
    path: "/departments",
    // requireAuth: true,
    element: <Departments />,
  },
  {
    path: "/languages",
    // requireAuth: true,
    element: <Languages />,
  },
  ...ApiAuthorzationRoutes,
];

export default AppRoutes;
