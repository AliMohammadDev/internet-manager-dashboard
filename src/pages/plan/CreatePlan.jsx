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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Save, Plus, Zap, Loader2, Info,
  Network, LayoutGrid, CircleDollarSign,
  Settings2
} from "lucide-react";
import { useAddPlan } from "@/api/plan";
import { useGetNetworks } from "@/api/network";
import planSchema from '@/lib/planSchema';

function CreatePlan({ setOpen, open, userId, userRole }) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(planSchema),
    defaultValues: {
      active: true,
      user_id: userId,
      name: "",
      speed: 0,
      price: 0,
      network_id: ""
    }
  });

  const activeValue = watch("active");
  const networkIdValue = watch("network_id");

  const addMutation = useAddPlan(() => {
    setOpen(false);
    reset();
  });

  const { data: networksData, isLoading: isLoadingNetworks } = useGetNetworks(1, 100, userId, userRole);
  const networks = networksData?.items || [];

  const onSubmit = (values) => {
    const finalData = {
      ...values,
      user_id: userId,
      speed: Number(values.speed),
      price: Number(values.price),
      network_id: Number(values.network_id)
    };
    addMutation.mutate(finalData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-2xl hover:bg-stone-800 transition-all shadow-md active:scale-95 font-bold font-cairo cursor-pointer">
          <Plus size={20} />
          <span>إضافة باقة جديدة</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-160 font-cairo p-11 rounded-[32px] max-h-[95vh] overflow-y-auto" dir="rtl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-right mb-6">
            <DialogTitle className="text-2xl font-black text-stone-900 flex items-center gap-3">
              <div className="bg-stone-100 p-2.5 rounded-2xl text-stone-700">
                <LayoutGrid size={24} />
              </div>
              <span style={{ fontFamily: "cairo" }}>تعريف باقة إنترنت</span>
            </DialogTitle>
            <DialogDescription className="text-stone-500 font-bold">
              قم بضبط خصائص الباقة والسرعة لتخصيصها للمشتركين.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* اسم الباقة والشبكة */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 mr-1 flex items-center gap-2">
                  <Settings2 size={16} /> اسم الباقة *
                </Label>
                <Input
                  {...register("name")}
                  placeholder="مثال: الباقة الفضية"
                  className={`rounded-2xl h-12 ${errors.name ? 'border-red-500' : 'border-stone-200'}`}
                />
                {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
              </div>

              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 mr-1 flex items-center gap-2">
                  <Network size={16} /> الشبكة التابعة *
                </Label>
                <Select
                  onValueChange={(val) => setValue("network_id", val)}
                  value={networkIdValue?.toString()}
                >
                  <SelectTrigger className={`rounded-2xl h-12 border-stone-200 ${errors.network_id ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder={isLoadingNetworks ? "جاري التحميل..." : "اختر الشبكة"} />
                  </SelectTrigger>
                  <SelectContent className="font-cairo" dir="rtl">
                    {networks.map((net) => (
                      <SelectItem key={net.id} value={net.id.toString()}>
                        {net.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.network_id && <span className="text-xs text-red-500">{errors.network_id.message}</span>}
              </div>
            </div>

            {/* السرعة والسعر */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 mr-1 flex items-center gap-2">
                  <Zap size={16} /> السرعة (Mbps) *
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.01"
                    {...register("speed")}
                    className="rounded-2xl h-12 border-stone-200 pr-4"
                  />
                </div>
              </div>

              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 mr-1 flex items-center gap-2">
                  <CircleDollarSign size={16} /> سعر الاشتراك ($) *
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("price")}
                  className="rounded-2xl h-12 border-stone-200"
                />
              </div>
            </div>

            {/* حالة الباقة */}
            <div className="flex items-center justify-between border border-stone-100 rounded-2xl h-14 px-5 bg-stone-50/50 mt-2 transition-all hover:bg-stone-50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeValue ? 'bg-green-100 text-green-600' : 'bg-stone-200 text-stone-500'}`}>
                  <Info size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-stone-800 text-sm">حالة الباقة</span>
                  <span className="text-xs text-stone-400">إتاحة الباقة للمشتركين</span>
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
              className="flex-1 bg-stone-900 text-white py-4 rounded-2xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {addMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              إتمام الحفظ
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
      </DialogContent>
    </Dialog>
  );
}

export default CreatePlan;