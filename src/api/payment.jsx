
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetPayments = (page = 1, limit = 10, userId, userRole) => {
  return useQuery({
    queryKey: ["payments", page, limit, userId],
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
      const res = await axios.post("/payment/get-all", payload);
      return res.data;
    },
  });
};

export const useGtPayment = (id) => {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: async () => {
      const res = await axios.get(`/payment/get-one/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useAddPayment = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentData) => {
      try {
        const res = await axios.post("/payment/create", paymentData);
        return res.data;
      } catch (error) {
        const message = error.response?.data?.message || "حدث خطأ أثناء إضافة الدفعة";
        throw new Error(message);
      }
    },
    onSuccess: (newPayment) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("تمت إضافة الدفعة بنجاح!");
      if (onSuccessCallback) onSuccessCallback(newPayment);
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error.message) ? error.message[0] : error.message;
      toast.error(errorMessage);
    }
  });
};

export const useEditPayment = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentData) => {
      const { id, ...data } = paymentData;
      try {
        const res = await axios.patch(`/payment/update/${id}`, data);
        return res.data;
      } catch (error) {
        const message = error.response?.data?.message || "فشل تحديث الدفعة الشبكة";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("تم تعديل الدفعة بنجاح");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error.message) ? error.message[0] : error.message;
      toast.error(errorMessage);
    }
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentId) => {
      await axios.delete(`/payment/remove/${paymentId}`);
      return paymentId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      toast.success("تم حذف الدفعة بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء حذف الدفعة");
    }
  });
};