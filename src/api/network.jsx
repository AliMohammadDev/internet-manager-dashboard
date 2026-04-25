
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetNetworks = (page = 1, limit = 10, userId, role) => {
  return useQuery({
    queryKey: ["networks", page, limit, userId],
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
      if (role !== "admin") {
        payload.user_id = {
          value: Number(userId)
        };
      }
      const res = await axios.post("/network/get-all", payload);
      return res.data;
    },
  });
};

export const useGetNetwork = (id) => {
  return useQuery({
    queryKey: ["network", id],
    queryFn: async () => {
      const res = await axios.get(`/network/get-one/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useAddNetwork = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (networkData) => {
      try {
        const res = await axios.post("/network/create", networkData);
        return res.data;
      } catch (error) {
        const message = error.response?.data?.message || "حدث خطأ أثناء إضافة الشبكة";
        throw new Error(message);
      }
    },
    onSuccess: (newNetwork) => {
      queryClient.invalidateQueries({ queryKey: ["networks"] });
      toast.success("تمت إضافة الشبكة بنجاح!");
      if (onSuccessCallback) onSuccessCallback(newNetwork);
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error.message) ? error.message[0] : error.message;
      toast.error(errorMessage);
    }
  });
};

export const useEditNetwork = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (networkData) => {
      const { id, ...data } = networkData;
      try {
        const res = await axios.patch(`/network/update/${id}`, data);
        return res.data;
      } catch (error) {
        const message = error.response?.data?.message || "فشل تحديث بيانات الشبكة";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["networks"] });
      toast.success("تم تعديل الشبكة بنجاح");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error.message) ? error.message[0] : error.message;
      toast.error(errorMessage);
    }
  });
};

export const useDeleteNetwork = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (networkId) => {
      await axios.delete(`/network/remove/${networkId}`);
      return networkId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["networks"] });
      toast.success("تم حذف الشبكة بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء حذف الشبكة");
    }
  });
};