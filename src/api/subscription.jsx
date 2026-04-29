import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";


export const useGetSubscriptions = (page = 1, limit = 10, userId, userRole) => {
  return useQuery({
    queryKey: ["subscriptions", page, limit, userId],
    queryFn: async () => {
      const payload = {
        pagination: {
          page: page,
          limit: limit
        },
        sort: {
          by: "id",
          type: "DESC"
        }
      };
      if (userRole !== "admin") {
        payload.user_id = {
          value: Number(userId)
        };
      }
      const res = await axios.post("/subscription/get-all", payload);
      return res.data;
    },
  });
};

export const useGetSubscription = (id) => {
  return useQuery({
    queryKey: ["subscription", id],
    queryFn: async () => {
      const res = await axios.get(`/subscription/get-one/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useAddSubscription = (onSuccessCallback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await axios.post("/subscription/create", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("تم إضافة الاشتراك بنجاح");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err) => toast.error(err.response?.data?.message || "فشل الإضافة")
  });
};

export const useEditSubscription = (onSuccessCallback) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subscriptionData) => {
      const { id, ...data } = subscriptionData;
      const res = await axios.patch(`/subscription/update/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("تم تحديث الاشتراك");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (err) => toast.error(err.response?.data?.message || "فشل التحديث")
  });
};

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/subscription/remove/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("تم حذف الاشتراك بنجاح");
    },
    onError: () => toast.error("حدث خطأ أثناء الحذف")
  });
};