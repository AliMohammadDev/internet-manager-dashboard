import React, { createContext, useContext, useState, useEffect } from "react";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { useGetUser } from "@/api/user";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const cookies = Cookie();
  const token = cookies.get("token");
  const [auth, setAuth] = useState({ userId: null, role: null });

  // فك التوكن مرة واحدة عند البداية
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setAuth({
          userId: decoded.id || decoded.userId, // تأكد من الاسم المطابق للتوكن
          role: decoded.role
        });
      } catch (err) {
        console.error("Invalid Token", err);
      }
    }
  }, [token]);

  // جلب بيانات المستخدم كاملة من الـ API
  const { data: userData, isLoading } = useGetUser(auth.userId);

  const logout = () => {
    cookies.remove("token");
    setAuth({ userId: null, role: null });
    window.location.pathname = "/login";
  };

  return (
    <AuthContext.Provider value={{
      ...auth,
      user: userData?.user || userData,
      isLoading,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);