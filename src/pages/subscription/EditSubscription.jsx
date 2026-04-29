import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditSubscription } from '@/api/subscription';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Calendar, Loader2, Info, Edit3, User, Wifi } from "lucide-react";
import { subscriptionSchema } from "@/lib/subscriptionSchema";

function EditSubscription({ subscription, open, setOpen }) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(subscriptionSchema),
  });

  useEffect(() => {
    if (subscription) {
      reset({
        customer_id: subscription.customer_id,
        plan_id: subscription.plan_id,
        point_id: subscription.point_id,
        end_date: subscription.end_date,
        active: subscription.active,
        status: subscription.status,
      });
    }
  }, [subscription, reset]);

  const activeValue = watch("active");
  const editMutation = useEditSubscription(() => setOpen(false));

  const onSubmit = (values) => {
    editMutation.mutate({
      ...values,
      id: subscription.id,
      customer_id: Number(values.customer_id),
      plan_id: Number(values.plan_id),
      point_id: Number(values.point_id),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-160 font-cairo p-11 rounded-[32px] max-h-[95vh] overflow-y-auto" dir="rtl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-right mb-6">
            <DialogTitle className="text-2xl font-black text-stone-900 flex items-center gap-3">
              <div className="bg-amber-50 p-2.5 rounded-2xl text-amber-600">
                <Edit3 size={24} />
              </div>
              <span style={{ fontFamily: "cairo" }}>تعديل تفاصيل الاشتراك</span>
            </DialogTitle>
            <DialogDescription className="text-stone-500 font-bold">
              تعديل مدة الاشتراك أو الحالة للمشترك: <span className="text-stone-900">{subscription?.customer?.name}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <div className="flex items-center gap-2 text-stone-500 text-xs mb-1"><User size={14} /> المشترك</div>
                <div className="font-bold text-stone-900">{subscription?.customer?.name}</div>
              </div>
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-2 text-indigo-500 text-xs mb-1"><Wifi size={14} /> الباقة الحالية</div>
                <div className="font-bold text-indigo-900">{subscription?.plan?.name}</div>
              </div>
            </div>

            <div className="grid gap-2 text-right">
              <Label className="font-bold text-stone-700 mr-1">تاريخ انتهاء الاشتراك الجديد *</Label>
              <div className="relative">
                <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <Input
                  type="date"
                  {...register("end_date")}
                  className="pr-10 rounded-2xl h-12 border-stone-200 focus:ring-amber-500"
                />
              </div>
              {errors.end_date && <span className="text-[13px] font-bold text-red-500 mr-1">⚠️{errors.end_date.message}</span>}
            </div>

            <div className="flex items-center justify-between border border-stone-100 rounded-2xl h-14 px-5 bg-stone-50/50 transition-all hover:bg-stone-50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeValue ? 'bg-green-100 text-green-600' : 'bg-stone-200 text-stone-500'}`}>
                  <Info size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-stone-800 text-sm">حالة الاشتراك</span>
                  <span className="text-xs text-stone-400">تفعيل أو إيقاف الخدمة يدوياً</span>
                </div>
              </div>
              <Switch
                checked={!!activeValue}
                onCheckedChange={(val) => setValue("active", val)}
                className="data-[state=checked]:bg-green-600"
              />
            </div>
          </div>

          <DialogFooter className="mt-8 flex gap-3">
            <button
              type="submit"
              disabled={editMutation.isPending}
              className="flex-1 bg-stone-900 text-white py-4 rounded-2xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {editMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              حفظ التعديلات
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 border border-stone-200 py-4 rounded-2xl font-bold hover:bg-stone-100 text-stone-600"
            >
              إلغاء
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditSubscription;