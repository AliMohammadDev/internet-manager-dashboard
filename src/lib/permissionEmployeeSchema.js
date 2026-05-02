import * as z from "zod";

export const permissionEmployeeSchema = z.object({
  employee_id: z.coerce.number({
    required_error: "يرجى اختيار الموظف",
    invalid_type_error: "يرجى اختيار الموظف"
  }).min(1, "يرجى اختيار الموظف"),

  permission_id: z.coerce.number({
    required_error: "يرجى اختيار الصلاحية",
    invalid_type_error: "يرجى اختيار الصلاحية"
  }).min(1, "يرجى اختيار الصلاحية"),
});