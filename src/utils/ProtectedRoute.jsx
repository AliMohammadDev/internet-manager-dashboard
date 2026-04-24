import Cookie from "cookie-universal";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const cookies = Cookie();
  const token = cookies.get("token");

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;




