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

export const useGetUser = (id) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await axios.get(`user/get-one/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useGetUserProfile = (id) => {
  return useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      const res = await axios.get(`user/my-profile/${id}`);
      return res.data;
    },
    enabled: !!id,
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
      const { id, ...data } = userData;
      try {
        const res = await axios.patch(`user/update/${id}`, data);
        return res.data;
      } catch (error) {
        const message = error.response?.data?.message || "فشل تحديث البيانات";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("تم التعديل بنجاح");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error.message) ? error.message[0] : error.message;
      toast.error(errorMessage);
    }
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId) => {
      await axios.delete(`user/remove/${userId}`);
      return userId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("تم حذف المستخدم");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء الحذف");
    }
  });
};