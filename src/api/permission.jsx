import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetPermissions = (page = 1, limit = 10, userId, userRole) => {
  return useQuery({
    queryKey: ["permissions", page, limit, userId],
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
      const res = await axios.post("/permission/get-all", payload);
      return res.data;
    },
  });
};

export const useGetPermission = (id) => {
  return useQuery({
    queryKey: ["permission", id],
    queryFn: async () => {
      const res = await axios.get(`/permission/get-one/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};


export const useAddPermission = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (permissionData) => {
      try {
        const res = await axios.post("/permission/create", permissionData);
        return res.data;
      } catch (error) {
        const message = error.response?.data?.message || "حدث خطأ أثناء إضافة الصلاحية";
        throw new Error(message);
      }
    },
    onSuccess: (newPermission) => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });

      toast.success("تمت إضافة الصلاحية بنجاح!");
      if (onSuccessCallback) onSuccessCallback(newPermission);
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error.message) ? error.message[0] : error.message;
      toast.error(errorMessage);
    }
  });
};

export const useEditPermission = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (permissionData) => {
      const { id, ...data } = permissionData;
      try {
        const res = await axios.patch(`/permission/update/${id}`, data);
        return res.data;
      } catch (error) {
        const message = error.response?.data?.message || "فشل تحديث بيانات الصلاحية";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });

      toast.success("تم تعديل بيانات الصلاحية بنجاح");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error.message) ? error.message[0] : error.message;
      toast.error(errorMessage);
    }
  });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (permissionId) => {
      await axios.delete(`/permission/remove/${permissionId}`);
      return permissionId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });

      toast.success("تم حذف الصلاحية بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء حذف الصلاحية");
    }
  });
};