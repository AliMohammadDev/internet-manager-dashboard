import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetPlans = (page = 1, limit = 10, userId, userRole) => {
  return useQuery({
    queryKey: ["plans", page, limit, userId],
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
          id: Number(userId)
        };
      }

      const res = await axios.post("/isp-system/plan/get-all", payload);
      return res.data;
    },
  });
};

export const useGetPlan = (id) => {
  return useQuery({
    queryKey: ["plan", id],
    queryFn: async () => {
      const res = await axios.get(`/isp-system/plan/get-one/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useAddPlan = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planData) => {
      try {
        const res = await axios.post("/isp-system/plan/create", planData);
        return res.data;
      } catch (error) {
        const message = error.response?.data?.message || "حدث خطأ أثناء إضافة الخطة";
        throw new Error(message);
      }
    },
    onSuccess: (newPlan) => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("تمت إضافة الخطة بنجاح!");
      if (onSuccessCallback) onSuccessCallback(newPlan);
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error.message) ? error.message[0] : error.message;
      toast.error(errorMessage);
    }
  });
};

export const useEditPlan = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planData) => {
      const { id, ...data } = planData;
      try {
        const res = await axios.patch(`/isp-system/plan/update/${id}`, data);
        return res.data;
      } catch (error) {
        const message = error.response?.data?.message || "فشل تحديث بيانات الخطة";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("تم تعديل الخطة بنجاح");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error.message) ? error.message[0] : error.message;
      toast.error(errorMessage);
    }
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planId) => {
      await axios.delete(`/isp-system/plan/remove/${planId}`);
      return planId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast.success("تم حذف الخطة بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء حذف الخطة");
    }
  });
};