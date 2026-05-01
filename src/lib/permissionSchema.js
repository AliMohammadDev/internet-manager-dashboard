import * as z from "zod";

export const permissionSchema = z.object({
  name: z
    .string()
    .min(3, "رمز الصلاحية يجب أن يكون 3 حروف على الأقل")
    .regex(/^[A-Z_]+$/, "يجب أن يتكون الرمز من أحرف كبيرة وعلامة _ فقط (مثال: CREATE_USER)"),

  description: z
    .string()
    .min(5, "الوصف يجب أن يكون 5 حروف على الأقل ليكون واضحاً"),

  active: z.boolean().default(true),
});