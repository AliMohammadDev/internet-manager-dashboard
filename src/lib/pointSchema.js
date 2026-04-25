
import * as z from "zod";

const pointSchema = z.object({
  location: z.string().min(3, "يرجى تحديد الموقع بدقة"),
  active: z.boolean().default(true),
  name: z.string().min(1, "يجب إدخال اسم النقطة"),
  max_subscription: z.coerce.number().int().min(1, "يجب تحديد أقصى عدد للمشتركين"),
  network_id: z.coerce.number().int().min(1, "يرجى اختيار شبكة"),
  notes: z.string().optional(),
  user_id: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: "" }).optional()
  ),
});

export default pointSchema;