import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetPoints = (page = 1, limit = 10, userId, userRole) => {
  return useQuery({
    queryKey: ["points", page, limit, userId],
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
      const res = await axios.post("/point/get-all", payload);
      return res.data;
    },
  });
};


export const useGetPoint = (id) => {
  return useQuery({
    queryKey: ["network", id],
    queryFn: async () => {
      const res = await axios.get(`/point/get-one/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useAddPoint = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (networkData) => {
      try {
        const res = await axios.post("/point/create", networkData);
        return res.data;
      } catch (error) {
        const message = error.response?.data?.message || "حدث خطأ أثناء إضافة النقطة";
        throw new Error(message);
      }
    },
    onSuccess: (newNetwork) => {
      queryClient.invalidateQueries({ queryKey: ["points"] });
      toast.success("تمت إضافة النقطة بنجاح!");
      if (onSuccessCallback) onSuccessCallback(newNetwork);
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error.message) ? error.message[0] : error.message;
      toast.error(errorMessage);
    }
  });
};

export const useEditPoint = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (networkData) => {
      const { id, ...data } = networkData;
      try {
        const res = await axios.patch(`/point/update/${id}`, data);
        return res.data;
      } catch (error) {
        const message = error.response?.data?.message || "فشل تحديث بيانات النقطة";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["points"] });
      toast.success("تم تعديل النقطة بنجاح");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error.message) ? error.message[0] : error.message;
      toast.error(errorMessage);
    }
  });
};

export const useDeletePoint = () => {
  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: async (networkId) => {
      await axios.delete(`/point/remove/${networkId}`);
      return networkId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["points"] });
      toast.success("تم حذف النقطة بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء حذف النقطة");
    }
  });
};