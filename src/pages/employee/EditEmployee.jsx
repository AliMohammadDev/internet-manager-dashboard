import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, UserCog, Mail, Lock, Loader2, Info } from "lucide-react";
import { useGetEmployee, useEditEmployee } from "@/api/employee";
import { editEmployeeSchema } from "@/lib/employeeSchema";
import { useState } from "react";
import { EyeOff } from "lucide-react";
import { Eye } from "lucide-react";

function EditEmployee({ employeeId, open, setOpen, userId, userRole }) {
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(editEmployeeSchema),
  });

  const { data: employeeData, isLoading } = useGetEmployee(employeeId);


  const editMutation = useEditEmployee(() => {
    setOpen(false);
  });

  const activeValue = watch("active");


  useEffect(() => {
    if (employeeData && open) {
      reset({
        full_name: employeeData.full_name,
        email: employeeData.email,
        active: employeeData.active,
        user_id: employeeData.user_id,
        password: '',
      });
    }
  }, [employeeData, open, reset]);

  const onSubmit = (values) => {
    const payload = { ...values, id: userId };
    if (!payload.password || payload.password.trim() === "") {
      delete payload.password;
    }
    editMutation.mutate(payload);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-150 font-cairo p-11 rounded-[32px] max-h-[95vh] overflow-y-auto" dir="rtl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="animate-spin text-stone-400" size={40} />
            <p className="mt-4 text-stone-500 font-bold">جاري تحميل بيانات الموظف...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader className="text-right mb-6">
              <DialogTitle className="text-2xl font-black text-stone-900 flex items-center gap-3">
                <div className="bg-blue-50 text-amber-600 p-2.5 rounded-2xl">
                  <UserCog size={24} />
                </div>
                <span style={{ fontFamily: 'cairo' }}>تعديل بيانات الموظف</span>
              </DialogTitle>
              <DialogDescription className="text-stone-500 font-bold mt-2">
                تحديث المعلومات الأساسية.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700">الاسم الكامل *</Label>
                <Input {...register("full_name")} className="rounded-2xl h-12" />
                {errors.full_name && <span className="text-xs text-red-500 font-bold">⚠️ {errors.full_name.message}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2 text-right">
                  <Label className="font-bold text-stone-700">البريد الإلكتروني *</Label>
                  <div className="relative">
                    <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <Input {...register("email")} className="pr-10 rounded-2xl h-12" />
                  </div>
                </div>

                <div className="grid gap-2 text-right">
                  <Label className="font-bold text-stone-900 ">كلمة المرور (اختياري)</Label>
                  <div className="relative">
                    <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...register("password")} placeholder="اتركها فارغة للحفاظ عليها" className="pr-10 rounded-2xl h-12" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border border-stone-100 rounded-2xl h-14 px-5 bg-stone-50/50 mt-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeValue ? 'bg-green-100 text-green-600' : 'bg-stone-200 text-stone-500'}`}>
                    <Info size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-stone-800 text-sm">حالة الحساب</p>
                    <p className="text-[10px] text-stone-400">نشط / معطل</p>
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
              <button type="submit" disabled={editMutation.isPending} className="flex-1 bg-stone-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
                {editMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                تحديث البيانات
              </button>
              <button type="button" onClick={() => setOpen(false)} className="flex-1 border border-stone-200 py-4 rounded-2xl font-bold text-stone-600 hover:bg-stone-50">إلغاء</button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default EditEmployee;