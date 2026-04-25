import * as z from "zod";

export const userSchema = z.object({
  name: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  phone: z.string().min(8, "رقم الهاتف غير صحيح"),
  email: z.string().email("البريد الإلكتروني غير صحيح").optional().or(z.literal('')),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  address: z.string().optional(),
  role: z.string().min(1, "الدور مطلوب"),
  description: z.string().min(1, "يرجى إضافة ملاحظة بسيطة"),
  active: z.boolean().default(true)
});