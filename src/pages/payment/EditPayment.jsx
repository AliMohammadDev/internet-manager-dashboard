import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2, Info, Edit3, Hash, CircleDollarSign } from "lucide-react";
import z from "zod";
import { useEditPayment, useGetPayments } from '@/api/payment';

const paymentSchema = z.object({
  subscription_id: z.string().min(1, "رقم الاشتراك مطلوب"),
  active: z.boolean(),
});

function EditPayment({ paymentId, open, setOpen, userId }) {
  const { data: paymentResponse, isLoading: isFetching } = useGetPayments(paymentId);
  const payment = paymentResponse;

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(paymentSchema),
  });

  useEffect(() => {
    if (payment) {
      reset({
        subscription_id: String(payment.subscription_id),
        active: payment.active,
      });
    }
  }, [payment, reset]);

  const activeValue = watch("active");

  const editMutation = useEditPayment(() => {
    setOpen(false);
  });

  const onSubmit = (values) => {
    editMutation.mutate({
      id: paymentId,
      subscription_id: Number(values.subscription_id),
      active: values.active,
      user_id: Number(userId)
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md font-cairo p-8 rounded-[32px]" dir="rtl">
        <DialogHeader className="text-right mb-6">
          <DialogTitle className="text-2xl font-black text-stone-900 flex items-center gap-3">
            <div className="bg-amber-50 p-2.5 rounded-2xl text-amber-600">
              <Edit3 size={24} />
            </div>
            <span style={{ fontFamily: 'cairo' }}>تعديل سجل الدفع</span>
          </DialogTitle>
          <DialogDescription className="text-stone-500 font-bold">
            تحديث بيانات الدفعة الخاصة بالاشتراك رقم: <span className="text-stone-900">{payment?.subscription_id}</span>
          </DialogDescription>
        </DialogHeader>

        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Loader2 className="animate-spin text-stone-400" size={32} />
            <p className="text-stone-500 font-bold">جاري جلب البيانات...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 flex items-center gap-2 mr-1">
                  <Hash size={16} /> رقم الاشتراك *
                </Label>
                <Input
                  type="number"
                  {...register("subscription_id")}
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
                    <span className="text-xs text-stone-400">تحديث حالة السجل في النظام</span>
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
                disabled={editMutation.isPending}
                className="flex-1 bg-stone-900 text-white py-4 rounded-2xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {editMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                حفظ التعديلات
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 border border-stone-200 py-4 rounded-2xl font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
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

export default EditPayment;