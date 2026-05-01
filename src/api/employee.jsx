import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetEmployees = (page = 1, limit = 10, userId, userRole) => {
  return useQuery({
    queryKey: ["employees", page, limit, userId],
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
      const res = await axios.post("/employee/get-all", payload);
      return res.data;
    },
  });
};

export const useGetEmployee = (id) => {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const res = await axios.get(`/employee/get-one/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};

export const useGetEmployeeStatistics = () => {
  return useQuery({
    queryKey: ["employee-statistics"],
    queryFn: async () => {
      const res = await axios.get(`/employee/employees-statistics`);
      return res.data;
    },
  });
};


export const useAddEmployee = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeData) => {
      try {
        const res = await axios.post("/employee/create", employeeData);
        return res.data;
      } catch (error) {
        const message = error.response?.data?.message || "حدث خطأ أثناء إضافة الموظف";
        throw new Error(message);
      }
    },
    onSuccess: (newEmployee) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee-statistics"] });

      toast.success("تمت إضافة الموظف بنجاح!");
      if (onSuccessCallback) onSuccessCallback(newEmployee);
    },
    onError: (error) => {
      const errorMessage = Array.isArray(error.message) ? error.message[0] : error.message;
      toast.error(errorMessage);
    }
  });
};

export const useEditEmployee = (onSuccessCallback) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeData) => {
      const { id, ...data } = employeeData;
      try {
        const res = await axios.patch(`/employee/update/${id}`, data);
        return res.data;
      } catch (error) {
        const message = error.response?.data?.message || "فشل تحديث بيانات الموظف";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee-statistics"] });
      toast.success("تم تعديل بيانات الموظف بنجاح");
      if (onSuccessCallback) onSuccessCallback();
    },

    onError: (error) => {
      const errorMessage = Array.isArray(error.message) ? error.message[0] : error.message;
      toast.error(errorMessage);
    }
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeId) => {
      await axios.delete(`/employee/remove/${employeeId}`);
      return employeeId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee-statistics"] });

      toast.success("تم حذف الموظف بنجاح");
    },
    onError: () => {
      toast.error("حدث خطأ أثناء حذف الموظف");
    }
  });
};