import * as z from "zod";
export const customerSchema = z.object({
  name: z.string().min(3, "الاسم يجب أن يكون 3 حروف على الأقل"),
  phone: z.string().min(7, "رقم الهاتف غير صحيح"),

  plan_id: z.coerce
    .number({ invalid_type_error: "يجب اختيار خطة" })
    .min(1, "يجب اختيار خطة"),

  point_id: z.coerce
    .number({ invalid_type_error: "يجب اختيار نقطة" })
    .min(1, "يجب اختيار نقطة"),

  network_id: z.coerce
    .number({ invalid_type_error: "يجب اختيار شبكة" })
    .min(1, "يجب اختيار شبكة"),

  active: z.boolean().default(true),
});


export const editCustomerSchema = z.object({
  name: z.string().min(3, "الاسم يجب أن يكون 3 حروف على الأقل"),
  phone: z.string().min(7, "رقم الهاتف غير صحيح"),

  plan_id: z.coerce.number().optional(),
  point_id: z.coerce.number().optional(),
  network_id: z.coerce.number().optional(),

  active: z.boolean().default(true),
});
