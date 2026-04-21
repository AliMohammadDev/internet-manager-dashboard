import axios from "axios";
import toast from "react-hot-toast";
import Cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const cookies = Cookie();

export const useUserLogin = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (credentials) => {
            const res = await axios.post("/auth/user-login", credentials);
            return res.data;
        },
        onSuccess: (data) => {
            if (data.access_token) {
                const expires = new Date();
                expires.setDate(expires.getDate() + 7);

                cookies.set("token", data.access_token, {
                    path: "/",
                    expires: expires,
                    secure: false,
                    sameSite: 'lax'
                });

                axios.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
            }
            toast.success("تم تسجيل الدخول بنجاح!");
            navigate("/");
        },
        onError: (error) => {
            const message = error.response?.data?.message || "بيانات الدخول غير صحيحة";
            toast.error(message);
        }
    });
};