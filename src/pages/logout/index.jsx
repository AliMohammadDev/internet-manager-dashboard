import { useEffect } from "react";
import Cookie from "cookie-universal";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const cookies = Cookie();

  useEffect(() => {
    queryClient.clear();

    cookies.remove("token", { path: "/" });

    delete axios.defaults.headers.common["Authorization"];

    navigate("/login", { replace: true });
  }, [queryClient, navigate, cookies]);

  return null;
};

export default Logout;
