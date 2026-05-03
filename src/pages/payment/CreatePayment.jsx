import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Plus, Loader2, Info, CircleDollarSign, Hash } from "lucide-react";
import { paymentSchema } from '@/lib/paymentSchema';
import { useAddPayment } from '@/api/payment';



function CreatePayment({ setOpen, open, userId, userRole }) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      active: true,
      subscription_id: "",
    }
  });

  const activeValue = watch("active");

  const addMutation = useAddPayment(() => {
    setOpen(false);
    reset();
  });

  const onSubmit = (values) => {
    const finalData = {
      subscription_id: Number(values.subscription_id),
      active: values.active,
      user_id: Number(userId)
    };
    addMutation.mutate(finalData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-2xl hover:bg-stone-800 transition-all shadow-md active:scale-95 font-bold font-cairo cursor-pointer">
          <Plus size={20} />
          <span>إضافة دفعة جديدة</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md font-cairo p-8 rounded-[32px]" dir="rtl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-right mb-6">
            <DialogTitle className="text-2xl font-black text-stone-900 flex items-center gap-3">
              <div className="bg-stone-100 p-2.5 rounded-2xl text-blue-600">
                <CircleDollarSign size={24} />
              </div>
              <span style={{ fontFamily: 'cairo' }}>إضافة سجل دفع</span>
            </DialogTitle>
            <DialogDescription className="text-stone-500 font-bold">
              أدخل رقم الاشتراك لتسجيل عملية الدفع في النظام.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid gap-2 text-right">
              <Label className="font-bold text-stone-700 flex items-center gap-2 mr-1">
                <Hash size={16} /> رقم الاشتراك (Subscription ID) *
              </Label>
              <Input
                type="number"
                {...register("subscription_id")}
                placeholder="أدخل رقم التعريف..."
                className={`rounded-2xl h-12 ${errors.subscription_id ? 'border-red-500' : 'border-stone-200'}`}
              />
              {errors.subscription_id && <span className="text-[13px] font-bold text-red-500 mr-1">⚠️ {errors.subscription_id.message}</span>}
            </div>

            <div className="flex items-center justify-between border border-stone-100 rounded-2xl h-16 px-5 bg-stone-50/50 transition-all hover:bg-stone-50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeValue ? 'bg-green-100 text-green-600' : 'bg-stone-200 text-stone-500'}`}>
                  <Info size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-stone-800 text-sm">حالة الدفع</span>
                  <span className="text-xs text-stone-400">تفعيل/تعطيل الاشتراك فوراً</span>
                </div>
              </div>
              <Switch
                checked={activeValue}
                onCheckedChange={(val) => setValue("active", val)}
                className="data-[state=checked]:bg-green-600"
              />
            </div>
          </div>

          <DialogFooter className="mt-8 flex gap-3">
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="flex-2 bg-stone-900 text-white py-4 rounded-2xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {addMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              تأكيد الدفع
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 border border-stone-200 py-4 rounded-2xl font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
            >
              إلغاء
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePayment;