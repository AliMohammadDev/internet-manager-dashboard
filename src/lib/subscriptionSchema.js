import { z } from "zod";

export const subscriptionSchema = z.object({
  customer_id: z.coerce.number({
    required_error: "يرجى اختيار الزبون",
    invalid_type_error: "يرجى اختيار الزبون"
  }).min(1, "يرجى اختيار الزبون"),

  plan_id: z.coerce.number({
    required_error: "يرجى اختيار الباقة",
    invalid_type_error: "يرجى اختيار الباقة"
  }).min(1, "يرجى اختيار الباقة"),

  point_id: z.coerce.number({
    required_error: "يرجى اختيار نقطة التوزيع",
    invalid_type_error: "يرجى اختيار نقطة التوزيع"
  }).min(1, "يرجى اختيار نقطة التوزيع"),

  end_date: z.string().min(1, "تاريخ الانتهاء مطلوب"),
  active: z.boolean().default(true),
  status: z.boolean().default(true),
});