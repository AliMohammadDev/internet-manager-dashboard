import App from "@/App";
import Customer from "@/pages/Customer";
import Employee from "@/pages/employee";
import Expense from "@/pages/Expense";
import Home from "@/pages/Home";
import Payment from "@/pages/payment";
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
        path: 'customers',
        element: <Customer />,
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
        path: 'payments',
        element: <Payment />,
      },
      {
        path: 'expenses',
        element: <Expense />,
      },
      {
        path: 'settings',
        element: <Setting />,
      },
    ],
  },
]);

export default router;
