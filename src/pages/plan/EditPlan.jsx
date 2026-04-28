import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetPlan, useEditPlan } from '@/api/plan';
import { useGetNetworks } from "@/api/network";
import planSchema from '@/lib/planSchema';
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
import { Save, Loader2, Info, Network, Edit3, Zap, CircleDollarSign, LayoutGrid } from "lucide-react";

function EditPlan({ planId, open, setOpen, userId, userRole }) {
  const { data: planResponse, isLoading: isFetchingPlan } = useGetPlan(planId);
  const plan = planResponse;


  const { data: networksData, isLoading: isLoadingNetworks } = useGetNetworks(1, 50, userId, userRole);
  const networks = networksData?.items || [];

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(planSchema),
  });

  useEffect(() => {
    if (plan) {
      reset({
        name: plan.name,
        speed: plan.speed,
        price: plan.price,
        active: plan.active,
        network_id: String(plan.network_id),
      });
    }
  }, [plan, reset]);

  const activeValue = watch("active");

  const editMutation = useEditPlan(() => {
    setOpen(false);
  });

  const onSubmit = (values) => {
    editMutation.mutate({
      ...values,
      speed: Number(values.speed),
      price: Number(values.price),
      network_id: Number(values.network_id),
      id: planId
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-150 font-cairo p-8 rounded-[32px] max-h-[95vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="text-right mb-6">
          <DialogTitle className="text-2xl font-black text-stone-900 flex items-center gap-3">
            <div className="bg-amber-50 p-2.5 rounded-2xl text-amber-600">
              <Edit3 size={24} />
            </div>
            <span className="font-cairo">تعديل بيانات الباقة</span>
          </DialogTitle>
          <DialogDescription className="text-stone-500 font-bold">
            تحديث خصائص الباقة: <span className="text-stone-900">{plan?.name}</span>
          </DialogDescription>
        </DialogHeader>

        {isFetchingPlan ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="animate-spin text-stone-400" size={40} />
            <p className="text-stone-500 font-bold">جاري تحميل بيانات الباقة...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5 py-2">
              {/* اسم الباقة والشبكة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2 text-right">
                  <Label className="font-bold text-stone-700 mr-1 flex items-center gap-2">
                    <LayoutGrid size={16} /> اسم الباقة *
                  </Label>
                  <Input
                    {...register("name")}
                    className={`rounded-2xl h-12 ${errors.name ? 'border-red-500' : 'border-stone-200'}`}
                  />
                  {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                </div>

                <div className="grid gap-2 text-right">
                  <Label className="font-bold text-stone-700 mr-1 flex items-center gap-2">
                    <Network size={16} /> الشبكة التابعة *
                  </Label>
                  <Select
                    defaultValue={String(plan?.network_id)}
                    onValueChange={(val) => setValue("network_id", val)}
                  >
                    <SelectTrigger className="rounded-2xl h-12 border-stone-200">
                      <SelectValue placeholder="اختر الشبكة" />
                    </SelectTrigger>
                    <SelectContent className="font-cairo" dir="rtl">
                      {networks.map((net) => (
                        <SelectItem key={net.id} value={net.id.toString()}>
                          {net.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* السرعة والسعر */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2 text-right">
                  <Label className="font-bold text-stone-700 mr-1 flex items-center gap-2">
                    <Zap size={16} className="text-amber-500" /> السرعة (Mbps) *
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("speed")}
                    className="rounded-2xl h-12 border-stone-200"
                  />
                </div>

                <div className="grid gap-2 text-right">
                  <Label className="font-bold text-stone-700 mr-1 flex items-center gap-2">
                    <CircleDollarSign size={16} className="text-green-600" /> سعر الاشتراك ($) *
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("price")}
                    className="rounded-2xl h-12 border-stone-200"
                  />
                </div>
              </div>

              {/* الحالة */}
              <div className="flex items-center justify-between border border-stone-100 rounded-2xl h-14 px-5 bg-stone-50/50 mt-2 transition-all hover:bg-stone-50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeValue ? 'bg-green-100 text-green-600' : 'bg-stone-200 text-stone-500'}`}>
                    <Info size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-stone-800 text-sm">حالة الباقة</span>
                    <span className="text-xs text-stone-400">نشطة حالياً للمشتركين</span>
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

export default EditPlan;