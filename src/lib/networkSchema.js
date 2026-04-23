import * as z from "zod";


export const networkSchema = z.object({
  name: z.string().min(3, "اسم الشبكة يجب أن يكون 3 أحرف على الأقل"),
  location: z.string().min(3, "يرجى تحديد الموقع بشكل أوضح"),
  active: z.boolean().default(true),
  user_id: z.number().optional(),
});