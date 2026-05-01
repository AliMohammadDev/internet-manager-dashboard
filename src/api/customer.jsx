import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetCustomers = (page = 1, limit = 10, userId, userRole) => {
  return useQuery({
    queryKey: ["customers", page, limit, userId],
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
      const res = await axios.post("/customer/get-all", payload);
      return res.data;
    },
  });
};

export const useGetCustomer = (id) => {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: async () => {
      const res = await axios.get(`/customer/get-one/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useGetCustomerStatistics = () => {
  return useQuery({
    queryKey: ["customers-statistics"],
    queryFn: async () => {
      const res = await axios.get("/customer/customers-statistics");
      return res.data;
    },
  });
};

export const useAddCustomer = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customerData) => {
      try {
        const res = await axios.post("/customer/create", customerData);
        return res.data;
      } catch (error) {
        const message = error.response?.data?.message || "حدث خطأ أثناء إضافة العميل";
        throw new Error(message);
      }
    },
    onSuccess: (newCustomer) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customers-statistics"] });

      toast.success("تمت إضافة العميل بنجاح!");
      if (onSuccessCallback) onSuccessCallback(newCustomer);
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error.message) ? error.message[0] : error.message;
      toast.error(errorMessage);
    }
  });
};

export const useEditCustomer = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customerData) => {
      const { id, ...data } = customerData;
      try {
        const res = await axios.patch(`/customer/update/${id}`, data);
        return res.data;
      } catch (error) {
        const message = error.response?.data?.message || "فشل تحديث بيانات العميل";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customers-statistics"] });

      toast.success("تم تعديل بيانات العميل بنجاح");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error.message) ? error.message[0] : error.message;
      toast.error(errorMessage);
    }
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customerId) => {
      await axios.delete(`/customer/remove/${customerId}`);
      return customerId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customers-statistics"] });

      toast.success("تم حذف العميل بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء حذف العميل");
    }
  });
};