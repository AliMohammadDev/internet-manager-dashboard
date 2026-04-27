import React, { useEffect } from 'react'
import { useForm } from "react-hook-form"
import { useGetNetwork, useEditNetwork } from '@/api/network'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, Edit3, Save, MapPin, Network as NetworkIcon, Globe, CheckCircle2 } from "lucide-react"

function EditNetwork({ networkId, open, setOpen }) {
  const { data: network, isLoading: isFetching } = useGetNetwork(networkId);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (network) {
      reset({
        name: network.name,
        location: network.location,
        active: network.active,
      });
    }
  }, [network, reset]);

  const activeValue = watch("active");

  const editMutation = useEditNetwork(() => {
    setOpen(false);
  });

  const onSubmit = (values) => {
    editMutation.mutate({ ...values, id: networkId });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-150 font-cairo p-10 overflow-hidden rounded-[32px]" dir="rtl">

        <DialogHeader className="text-right mb-8">
          <DialogTitle className="text-2xl font-black text-stone-900 flex items-center gap-3 font-cairo">
            <div className="bg-amber-50 p-2.5 rounded-2xl text-amber-600">
              <Edit3 size={24} />
            </div>
            تعديل بيانات الشبكة
          </DialogTitle>
          <DialogDescription className="text-stone-500 mt-2 text-base font-cairo">
            أنت تقوم الآن بتحديث بيانات شبكة <span className="font-bold text-stone-800">{network?.name}</span>.
          </DialogDescription>
        </DialogHeader>

        {isFetching ? (
          <div className="flex flex-col justify-center items-center h-80 gap-4">
            <Loader2 className="animate-spin text-amber-600" size={48} />
            <p className="text-stone-500 font-bold">جاري تحميل بيانات الشبكة...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>

            <div className="grid gap-6 py-2">
              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 flex items-center gap-2 pr-1">
                  <Globe size={15} className="text-stone-400" /> اسم الشبكة
                </Label>
                <Input
                  {...register("name", { required: "اسم الشبكة مطلوب" })}
                  className={`rounded-2xl h-12 text-right text-base border-stone-200 focus:ring-amber-500 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <span className="text-xs text-red-500 mr-1">{errors.name.message}</span>}
              </div>

              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 flex items-center gap-2 pr-1">
                  <MapPin size={15} className="text-stone-400" /> الموقع الجغرافي
                </Label>
                <Input
                  {...register("location", { required: "الموقع مطلوب" })}
                  className={`rounded-2xl h-12 text-right text-base border-stone-200 focus:ring-amber-500 ${errors.location ? 'border-red-500' : ''}`}
                />
                {errors.location && <span className="text-xs text-red-500 mr-1">{errors.location.message}</span>}
              </div>

              <div className="flex items-center justify-between border border-stone-100 rounded-2xl h-14 px-5 bg-stone-50/50 mt-2 transition-all hover:bg-stone-50">
                <Label className="font-bold text-stone-700 cursor-pointer flex items-center gap-2 text-sm">
                  <CheckCircle2 size={18} className={activeValue ? "text-green-500" : "text-stone-300"} />
                  حالة الشبكة: {activeValue ? 'نشطة حالياً' : 'معطلة مؤقتاً'}
                </Label>
                <Switch
                  checked={!!activeValue}
                  onCheckedChange={(val) => setValue("active", val)}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>
            </div>

            <DialogFooter className="flex-row-reverse gap-4 mt-10">
              <button
                type="submit"
                disabled={editMutation.isPending}
                className="flex-2 bg-stone-900 text-white py-4 rounded-2xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] disabled:opacity-70 text-base"
              >
                {editMutation.isPending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}
                <span>حفظ التعديلات</span>
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 px-6 py-4 border border-stone-200 rounded-2xl text-stone-500 font-bold hover:bg-stone-50 hover:text-stone-700 transition-all text-base"
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

export default EditNetwork;