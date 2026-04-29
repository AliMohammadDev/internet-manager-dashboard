import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditSubscription, useGetSubscription } from '@/api/subscription';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Save, Calendar, Loader2, Info, Edit3, User, Wifi, MapPin } from "lucide-react";
import { subscriptionSchema } from "@/lib/subscriptionSchema";
import { useGetCustomers } from '@/api/customer';
import { useGetPoints } from '@/api/point';
import { useGetPlans } from '@/api/plan';

function EditSubscription({ subscriptionId, open, setOpen, userId, userRole }) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(subscriptionSchema),
  });


  const { data: subscriptionData, isLoading: isFetchingSubscription } = useGetSubscription(subscriptionId);

  const { data: customersData } = useGetCustomers(1, 100, userId, userRole);
  const { data: pointsData } = useGetPoints(1, 100, userId, userRole);
  const { data: planData } = useGetPlans(1, 100, userId, userRole);

  useEffect(() => {
    if (subscriptionData) {
      reset({
        customer_id: subscriptionData.customer_id,
        plan_id: subscriptionData.plan_id,
        point_id: subscriptionData.point_id,
        end_date: subscriptionData.end_date,
        active: subscriptionData.active,
      });
    }
  }, [subscriptionData, reset]);

  const activeValue = watch("active");
  const editMutation = useEditSubscription(() => setOpen(false));

  const onSubmit = (values) => {
    editMutation.mutate({
      ...values,
      id: subscriptionData.id,
      customer_id: Number(values.customer_id),
      plan_id: Number(values.plan_id),
      point_id: Number(values.point_id),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogContent className="sm:max-w-150 font-cairo p-11 rounded-[32px] border-none shadow-2xl" dir="rtl">

        <DialogHeader className="text-right">
          <DialogTitle className="text-2xl font-black text-stone-900 flex items-center gap-3">
            <div className="bg-amber-50 p-2.5 rounded-2xl text-amber-600">
              <Edit3 size={24} />
            </div>
            <span style={{ fontFamily: "cairo" }}>تحديث بيانات الاشتراك</span>
          </DialogTitle>
          <DialogDescription className="text-stone-500 font-medium">
            قم بتعديل بيانات المشترك أو الباقة ونقطة التوزيع وتاريخ الانتهاء.
          </DialogDescription>
        </DialogHeader>

        {isFetchingSubscription ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-stone-400" size={40} />
            <p className="text-stone-500 font-bold">جاري تحميل بيانات النقطة...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2 text-right">
                <Label className="font-bold text-stone-700 flex items-center gap-2 mr-1">
                  <User size={15} className="text-stone-400" /> الزبون
                </Label>
                <Select

                  defaultValue={subscriptionData?.customer_id}
                  onValueChange={(val) => setValue("customer_id", val)}
                >
                  <SelectTrigger className="rounded-2xl h-12 border-stone-200 bg-stone-50/50 focus:ring-stone-900">
                    <SelectValue placeholder="اختر الزبون" />
                  </SelectTrigger>
                  <SelectContent className="font-cairo">
                    {customersData?.items?.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 text-right">
                <Label className="font-bold text-stone-700 flex items-center gap-2 mr-1">
                  <Wifi size={15} className="text-stone-400" /> الباقة
                </Label>
                <Select
                  defaultValue={subscriptionData?.plan_id}
                  onValueChange={(val) => setValue("plan_id", val)}
                >
                  <SelectTrigger className="rounded-2xl h-12 border-stone-200 bg-stone-50/50 focus:ring-stone-900">
                    <SelectValue placeholder="اختر الباقة" />
                  </SelectTrigger>
                  <SelectContent className="font-cairo">
                    {planData?.items?.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>{p.name} - {p.price}$</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 text-right">
                <Label className="font-bold text-stone-700 flex items-center gap-2 mr-1">
                  <MapPin size={15} className="text-stone-400" /> نقطة التوزيع
                </Label>
                <Select
                  defaultValue={subscriptionData?.point_id}
                  onValueChange={(val) => setValue("point_id", val)}
                >
                  <SelectTrigger className="rounded-2xl h-12 border-stone-200 bg-stone-50/50 focus:ring-stone-900">
                    <SelectValue placeholder="اختر النقطة" />
                  </SelectTrigger>
                  <SelectContent className="font-cairo">
                    {pointsData?.items?.map((pt) => (
                      <SelectItem key={pt.id} value={String(pt.id)}>{pt.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 text-right">
                <Label className="font-bold text-stone-700 flex items-center gap-2 mr-1">
                  <Calendar size={15} className="text-stone-400" /> تاريخ الانتهاء
                </Label>
                <div className="relative">
                  <Input
                    type="date"
                    {...register("end_date")}
                    className="rounded-2xl h-12 border-stone-200 bg-stone-50/50 focus:ring-stone-900 text-right pr-4"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-2 border-stone-100 rounded-[24px] p-5 bg-stone-50/30 transition-all hover:border-stone-200">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeValue ? 'bg-green-100 text-green-600' : 'bg-stone-200 text-stone-500'}`}>
                  <Info size={22} />
                </div>
                <div className="flex flex-col text-right">
                  <span className="font-extrabold text-stone-800">حالة الاشتراك</span>
                  <span className="text-xs text-stone-500 font-medium">تحويل الاشتراك إلى نشط أو متوقف</span>
                </div>
              </div>
              <Switch
                checked={!!activeValue}
                onCheckedChange={(val) => setValue("active", val)}
                className="data-[state=checked]:bg-green-600"
              />
            </div>

            <DialogFooter className="flex flex-row-reverse gap-3 pt-4">
              <button
                type="submit"
                disabled={editMutation.isPending}
                className="flex-2 bg-stone-900 text-white h-14 rounded-2xl font-black hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-stone-200 disabled:opacity-50"
              >
                {editMutation.isPending ? <Loader2 className="animate-spin" size={22} /> : <Save size={22} />}
                تحديث البيانات
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 border-2 border-stone-100 h-14 rounded-2xl font-bold hover:bg-stone-50 text-stone-500 transition-colors"
              >
                إلغاء
              </button>
            </DialogFooter>
          </form>
        )}

      </DialogContent>
    </Dialog>
  );
}

export default EditSubscription;