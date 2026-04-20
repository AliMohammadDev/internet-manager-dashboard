import App from "@/App";
import Employee from "@/pages/employee";
import Home from "@/pages/Home";
import Plan from "@/pages/plan";
import Point from "@/pages/point";
import Setting from "@/pages/setting";
import Subscription from "@/pages/subscription";
import User from "@/pages/user";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'users',
        element: <User />,
      },
      {
        path: 'employees',
        element: <Employee />,
      },
      {
        path: 'plans',
        element: <Plan />,
      },

      {
        path: 'subscriptions',
        element: <Subscription />,
      },

      {
        path: 'access-points',
        element: <Point />,
      },

      {
        path: 'settings',
        element: <Setting />,
      },
    ],
  },
]);

export default router;
