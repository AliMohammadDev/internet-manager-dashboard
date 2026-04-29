import * as z from "zod";

export const customerSchema = z.object({
  name: z.string().min(3, "الاسم يجب أن يكون 3 حروف على الأقل"),
  phone: z.string().min(7, "رقم الهاتف غير صحيح"),
  plan_id: z.number().min(1, "يجب اختيار خطة"),
  point_id: z.number().min(1, "يجب اختيار نقطة"),
  network_id: z.number().min(1, "يجب اختيار شبكة"),
  active: z.boolean().default(true),
});
