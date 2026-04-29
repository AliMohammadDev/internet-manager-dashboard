import React from 'react'
import { useForm } from "react-hook-form"
import { useAddNetwork } from '@/api/network'
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
import { Loader2, Network, Save, MapPin, CheckCircle2, Globe } from "lucide-react"
import { zodResolver } from '@hookform/resolvers/zod'
import { networkSchema } from '@/lib/networkSchema'

function CreateNetwork({ open, setOpen, userId }) {

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(networkSchema),
    defaultValues: {
      active: true,
      user_id: userId
    }
  });

  const activeValue = watch("active");

  const addNetworkMutation = useAddNetwork(() => {
    setOpen(false);
    reset();
  });

  const onSubmit = (values) => {
    const payload = {
      ...values,
      user_id: Number(userId)
    };
    addNetworkMutation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-150 font-cairo p-10 overflow-hidden rounded-[32px]" dir="rtl">
        <form onSubmit={handleSubmit(onSubmit)}>

          <DialogHeader className="text-right mb-6">
            <DialogTitle className="text-2xl font-black text-stone-900 flex items-center gap-3 font-cairo">
              <div className="bg-stone-100 p-2.5 rounded-2xl text-stone-700">
                <Network size={24} />
              </div>
              إضافة شبكة جديدة
            </DialogTitle>
            <DialogDescription className="text-stone-500 mt-2 text-base font-cairo">
              أدخل تفاصيل الشبكة الجغرافية ليتمكن المشتركون من الانضمام إليها.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-2">
            <div className="grid gap-2 text-right">
              <Label className="font-bold text-stone-700 flex items-center gap-2 pr-1">
                <Globe size={15} className="text-stone-400" /> اسم الشبكة *
              </Label>
              <Input
                {...register("name", { required: "هذا الحقل مطلوب" })}
                placeholder="أدخل اسم الشبكة (مثلاً: شبكة التل الرئيسية)"
                className={`rounded-2xl h-12 text-right text-base border-stone-200 focus:ring-stone-900 ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <span className="text-[13px] font-bold text-red-500 mr-1">⚠️{errors.name.message}</span>}
            </div>

            <div className="grid gap-2 text-right">
              <Label className="font-bold text-stone-700 flex items-center gap-2 pr-1">
                <MapPin size={15} className="text-stone-400" /> الموقع الجغرافي *
              </Label>
              <Input
                {...register("location", { required: "يرجى تحديد الموقع" })}
                placeholder="المدينة، الحي، أو إحداثيات الموقع"
                className={`rounded-2xl h-12 text-right text-base border-stone-200 focus:ring-stone-900 ${errors.location ? 'border-red-500' : ''}`}
              />
              {errors.location && <span className="text-[13px] font-bold text-red-500 mr-1">⚠️{errors.location.message}</span>}
            </div>

            <div className="flex items-center justify-between border border-stone-100 rounded-2xl h-14 px-5 bg-stone-50/50 mt-2 transition-all hover:bg-stone-50">
              <Label className="font-bold text-stone-700 cursor-pointer flex items-center gap-2">
                <CheckCircle2 size={18} className={`${activeValue ? 'text-green-500' : 'text-stone-300'} transition-colors`} />
                تفعيل الشبكة فوراً
              </Label>
              <Switch
                checked={activeValue}
                onCheckedChange={(val) => setValue("active", val)}
                className="data-[state=checked]:bg-green-600"
              />
            </div>

          </div>
          <DialogFooter className="flex flex-col-reverse md:flex-row-reverse gap-3 md:gap-4 mt-8 md:mt-10 font-cairo">
            <button
              type="submit"
              disabled={addNetworkMutation.isPending}
              className="w-full md:flex-2 bg-stone-900 text-white py-4 rounded-2xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-stone-100 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-base"
            >
              {addNetworkMutation.isPending ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              <span>{addNetworkMutation.isPending ? "جاري الإطلاق..." : "حفظ وإطلاق الشبكة"}</span>
            </button>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full md:flex-1 px-6 py-4 border border-stone-200 rounded-2xl text-stone-500 font-bold hover:bg-stone-50 hover:text-stone-700 transition-all text-base"
            >
              إلغاء
            </button>
          </DialogFooter>


        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateNetwork