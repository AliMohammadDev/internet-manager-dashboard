import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetUsers = (page = 1, limit = 10) => {
    return useQuery({
        queryKey: ["users", page, limit],
        queryFn: async () => {
            const res = await axios.post("/user/get-all", {
                pagination: {
                    page: page,
                    limit: limit
                },
                sort: {
                    by: "id",
                    type: "DESC"
                }
            });

            return res.data;
        },
    });
};

export const useAddUser = (onSuccessCallback) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userData) => {
            try {
                const res = await axios.post("user/create", userData);
                return res.data;
            } catch (error) {
                const message = error.response?.data?.message || "حدث خطأ أثناء إضافة المستخدم";
                throw new Error(message);
            }
        },
        onSuccess: (newUser) => {
            queryClient.invalidateQueries({ queryKey: ["users"] });

            toast.success("تمت إضافة المستخدم بنجاح!");
            if (onSuccessCallback) onSuccessCallback(newUser);
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
};

export const useEditUser = (onSuccessCallback) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userData) => {
            try {
                const res = await axios.patch(`user/update/${userData.id}`, userData);
                return res.data;
            } catch (error) {
                const message = error.response?.data?.message || "فشل تحديث البيانات";
                throw new Error(message);
            }
        },
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(["users"], (oldData) => {
                return oldData?.map((user) => (user.id === updatedUser.id ? updatedUser : user));
            });
            toast.success("تم التعديل بنجاح");
            if (onSuccessCallback) onSuccessCallback();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userId) => {
            await axios.delete(`user/delete/${userId}`);
            return userId;
        },
        onSuccess: (userId) => {
            queryClient.setQueryData(["users"], (oldData) => {
                return oldData?.filter((user) => user.id !== userId);
            });
            toast.success("تم حذف المستخدم");
        },
        onError: () => {
            toast.error("حدث خطأ أثناء الحذف");
        }
    });
};