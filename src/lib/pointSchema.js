
import * as z from "zod";

const pointSchema = z.object({
  location: z.string().min(3, "يرجى تحديد الموقع بدقة"),
  active: z.boolean().default(true),
  point_value: z.coerce.number().int().min(1, "يجب إدخال قيمة النقطة"),
  max_subscription: z.coerce.number().int().min(1, "يجب تحديد أقصى عدد للمشتركين"),
  network_id: z.coerce.number().int().min(1, "يرجى اختيار شبكة"),
  notes: z.string().optional(),
});

export default pointSchema;