import * as z from "zod";

const planSchema = z.object({
  name: z.string().min(3, "يجب أن يكون اسم الباقة 3 أحرف على الأقل"),

  speed: z.coerce
    .number({ invalid_type_error: "يرجى إدخال سرعة صحيحة" })
    .min(0, "السرعة لا يمكن أن تكون أقل من 0"),

  price: z.coerce
    .number({ invalid_type_error: "يرجى إدخال سعر صحيح" })
    .min(0, "السعر لا يمكن أن يكون أقل من 0"),

  network_id: z.coerce
    .number()
    .int()
    .min(1, "يرجى اختيار الشبكة التابعة للباقة"),

  active: z.boolean().default(true),

  user_id: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: "" }).optional()
  ),
});

export default planSchema;