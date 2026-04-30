import { z } from "zod";

export const employeeSchema = z.object({
  full_name: z
    .string()
    .min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل" })
    .max(50, { message: "الاسم طويل جداً" }),

  email: z
    .string()
    .email({ message: "البريد الإلكتروني غير صحيح" }),

  password: z
    .string()
    .min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" })
    .optional()
    .or(z.literal('')),

  user_id: z
    .preprocess((val) => Number(val), z.number().min(1, { message: "يجب اختيار مستخدم مرتبط" })),

  active: z
    .boolean()
    .default(true),

  refresh_token: z
    .string()
    .optional()
    .nullable(),
});