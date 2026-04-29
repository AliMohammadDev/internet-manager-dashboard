import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetCustomer, useEditCustomer } from '@/api/customer';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { Save, User, Phone, Loader2, Info, Edit3 } from "lucide-react";
import { editCustomerSchema } from '@/lib/customerSchema';

function EditCustomer({ customerId, open, setOpen, userId, userRole }) {
  const { data: customer, isLoading: isFetchingCustomer } = useGetCustomer(customerId);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(editCustomerSchema),
  });

  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name,
        phone: customer.phone,
        active: customer.active,
      });
    }
  }, [customer, reset]);

  const activeValue = watch("active");
  const editMutation = useEditCustomer(() => setOpen(false));

  const onSubmit = (values) => {
    editMutation.mutate({
      ...values,
      id: customerId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-160 font-cairo p-11 rounded-[32px] max-h-[95vh] overflow-y-auto" dir="rtl">

        <DialogHeader className="text-right mb-6">
          <DialogTitle className="text-2xl font-black text-stone-900 flex items-center gap-3">
            <div className="bg-amber-50 p-2.5 rounded-2xl text-amber-600">
              <Edit3 size={24} />
            </div>
            <span>تعديل بيانات المشترك</span>
          </DialogTitle>
          <DialogDescription className="text-stone-500 font-bold">
            تحديث الارتباط الفني للزبون: <span className="text-stone-900">{customer?.name}</span>
          </DialogDescription>
        </DialogHeader>

        {isFetchingCustomer ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-stone-400" size={40} />
            <p className="text-stone-500 font-bold">جاري تحميل بيانات الزبون...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6 py-2">

              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 mr-1">اسم الزبون الكامل *</Label>
                <div className="relative">
                  <User size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <Input
                    {...register("name")}
                    className={`pr-10 rounded-2xl h-12 border-stone-200 focus:ring-amber-500`}
                  />
                </div>
                {errors.name && <span className="text-[13px] font-bold text-red-500 mr-1">⚠️{errors.name.message}</span>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2 text-right md:col-span-2">
                  <Label className="font-bold text-stone-700 mr-1 flex items-center gap-2">
                    <Phone size={16} /> رقم التواصل *
                  </Label>
                  <Input
                    {...register("phone")}
                    className="rounded-2xl h-12 border-stone-200 w-full"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border border-stone-100 rounded-2xl h-14 px-5 bg-stone-50/50 mt-2 transition-all hover:bg-stone-50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeValue ? 'bg-green-100 text-green-600' : 'bg-stone-200 text-stone-500'}`}>
                    <Info size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-stone-800 text-sm">حالة الاشتراك</span>
                    <span className="text-xs text-stone-400">تفعيل أو إيقاف الخدمة</span>
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
                className="flex-1 border border-stone-200 py-4 rounded-2xl font-bold hover:bg-stone-100 transition-colors text-stone-600"
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

export default EditCustomer;