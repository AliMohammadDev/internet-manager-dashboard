
import z from "zod";

export const paymentSchema = z.object({
  subscription_id: z.string().min(1, "رقم الاشتراك مطلوب"),
  active: z.boolean().default(true),
});