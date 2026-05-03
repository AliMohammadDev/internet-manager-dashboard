import App from "@/App";
import Login from "@/pages/auth/Login";
import Customer from "@/pages/customer";
import Employee from "@/pages/employee";
import Expense from "@/pages/expense";
import Home from "@/pages/Home";
import Logout from "@/pages/logout";
import Payment from "@/pages/payment";
import Plan from "@/pages/plan";
import Point from "@/pages/point";
import Setting from "@/pages/setting";
import Subscription from "@/pages/subscription";
import User from "@/pages/user";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "@/pages/NotFound";
import Network from "@/pages/network";
import Permission from "@/pages/permission";
import PermissionEmployee from "@/pages/permissionEmployee";
import ExpenseType from "@/pages/expenseType";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <App />,
        children: [
          { index: true, element: <Home /> },
          { path: 'users', element: <User /> },
          { path: 'customers', element: <Customer /> },
          { path: 'employees', element: <Employee /> },
          { path: 'permissions', element: <Permission /> },
          { path: 'employees-permissions', element: < PermissionEmployee /> },
          { path: 'networks', element: <Network /> },
          { path: 'plans', element: <Plan /> },
          { path: 'subscriptions', element: <Subscription /> },
          { path: 'access-points', element: <Point /> },
          { path: 'payments', element: <Payment /> },
          { path: 'expenses', element: <Expense /> },
          { path: 'expenses-types', element: <ExpenseType /> },
          { path: 'settings', element: <Setting /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: '/logout',
    element: <Logout />,
  },
]);
export default router;
