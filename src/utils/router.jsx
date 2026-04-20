import App from "@/App";
import Home from "@/pages/Home";
import Setting from "@/pages/setting/Setting";
import User from "@/pages/user/User";
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
        path: 'settings',
        element: <Setting />,
      },
    ],
  },
]);

export default router;
