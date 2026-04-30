import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Ticket, Loader2, Calendar, User, Wifi, MapPin } from "lucide-react";
import { useAddSubscription } from "@/api/subscription";
import { useGetCustomers } from "@/api/customer";
import { useGetPlans } from "@/api/plan";
import { useGetPoints } from "@/api/point";
import { subscriptionSchema } from "@/lib/subscriptionSchema";

function CreateSubscription({ open, setOpen, userId, userRole }) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      active: true,
      status: true,
      customer_id: "",
      plan_id: "",
      point_id: "",
      end_date: new Date().toISOString().split('T')[0]
    }
  });

  const activeValue = watch("active");

  // Mutations & Queries
  const addMutation = useAddSubscription(() => {
    setOpen(false);
    reset();
  });

  const { data: customersData } = useGetCustomers(1, 1000, userId, userRole);
  const { data: plansData } = useGetPlans(1, 100, userId, userRole);
  const { data: pointsData } = useGetPoints(1, 100, userId, userRole);

  const onSubmit = (values) => {
    addMutation.mutate({
      ...values,
      user_id: userId,
      customer_id: Number(values.customer_id),
      plan_id: Number(values.plan_id),
      point_id: Number(values.point_id),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-160 font-cairo p-11 rounded-[32px] max-h-[95vh] overflow-y-auto" dir="rtl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-right mb-8">
            <DialogTitle className="text-2xl font-black text-stone-900 flex items-center gap-3">
              <div className="bg-stone-100 p-2.5 rounded-2xl text-blue-600">
                <Ticket size={24} />
              </div>
              <span style={{ fontFamily: "cairo" }}>تفعيل اشتراك جديد</span>
            </DialogTitle>
            <DialogDescription className="text-stone-500 font-bold">
              قم بتعبئة البيانات لربط الزبون بالخطة وتحديد تاريخ الانتهاء.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 font-cairo">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 flex items-center gap-2 mr-1">
                  <User size={16} className="text-stone-400" /> الزبون المشترك *
                </Label>
                <Select
                  onValueChange={(v) => setValue("customer_id", Number(v), { shouldValidate: true })}
                  value={watch("customer_id")?.toString()}
                >
                  <SelectTrigger className="rounded-2xl h-12 border-stone-200 bg-white focus:ring-2 focus:ring-stone-100 transition-all">
                    <SelectValue placeholder="اختر الزبون..." />
                  </SelectTrigger>
                  <SelectContent dir="rtl" className="font-cairo rounded-2xl shadow-xl border-stone-100">
                    {customersData?.items?.map(c => (
                      <SelectItem key={c.id} value={c.id.toString()} className="cursor-pointer py-2.5">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.customer_id && <span className="text-[13px] font-bold text-red-500 mr-1">⚠️ {errors.customer_id.message}</span>}
              </div>

              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 flex items-center gap-2 mr-1">
                  <Wifi size={16} className="text-stone-400" /> باقة الاشتراك *
                </Label>
                <Select
                  onValueChange={(v) => setValue("plan_id", Number(v), { shouldValidate: true })}
                  value={watch("plan_id")?.toString()}
                >
                  <SelectTrigger className="rounded-2xl h-12 border-stone-200 bg-white focus:ring-2 focus:ring-stone-100">
                    <SelectValue placeholder="اختر الباقة" />
                  </SelectTrigger>
                  <SelectContent dir="rtl" className="font-cairo rounded-2xl shadow-xl">
                    {plansData?.items?.map(p => (
                      <SelectItem key={p.id} value={p.id.toString()} className="cursor-pointer py-2.5">
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.plan_id && <span className="text-[13px] font-bold text-red-500 mr-1">⚠️ {errors.plan_id.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 flex items-center gap-2 mr-1">
                  <MapPin size={16} className="text-stone-400" /> نقطة التوزيع *
                </Label>
                <Select
                  onValueChange={(v) => setValue("point_id", Number(v), { shouldValidate: true })}
                  value={watch("point_id")?.toString()}
                >
                  <SelectTrigger className="rounded-2xl h-12 border-stone-200 bg-white focus:ring-2 focus:ring-stone-100">
                    <SelectValue placeholder="اختر النقطة" />
                  </SelectTrigger>
                  <SelectContent dir="rtl" className="font-cairo rounded-2xl shadow-xl">
                    {pointsData?.items?.map(pt => (
                      <SelectItem key={pt.id} value={pt.id.toString()} className="cursor-pointer py-2.5">
                        {pt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.point_id && <span className="text-[13px] font-bold text-red-500 mr-1">⚠️ {errors.point_id.message}</span>}
              </div>

              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 flex items-center gap-2 mr-1">
                  <Calendar size={16} className="text-stone-400" /> تاريخ انتهاء الاشتراك *
                </Label>
                <Input
                  type="date"
                  {...register("end_date")}
                  className="rounded-2xl h-12 border-stone-200 bg-white focus:ring-2 focus:ring-stone-100 transition-all"
                />
                {errors.end_date && <span className="text-[13px] font-bold text-red-500 mr-1">⚠️ {errors.end_date.message}</span>}
              </div>
            </div>

            {/* السطر الأخير: التفعيل الفوري (يمكنك تركه يأخذ السطر كاملاً أو نصفه) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="flex flex-col gap-2 text-right">
                <div className="flex items-center justify-between border border-stone-100 rounded-2xl h-12 px-4 bg-stone-50/50 transition-all hover:bg-stone-50">
                  <span className="font-bold text-stone-700 text-sm">تفعيل فوري للمشترك</span>
                  <Switch
                    checked={activeValue}
                    onCheckedChange={(val) => setValue("active", val)}
                    className="data-[state=checked]:bg-green-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-10 flex gap-3">
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="flex-1 bg-stone-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-all disabled:opacity-50"
            >
              {addMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              تأكيد التفعيل
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 border border-stone-200 py-4 rounded-2xl font-bold text-stone-600 hover:bg-stone-50 transition-all"
            >
              إلغاء
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateSubscription;