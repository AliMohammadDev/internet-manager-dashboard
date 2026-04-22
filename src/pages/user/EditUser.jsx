import React, { useEffect } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useGetUser, useEditUser } from '@/api/user'
import { userSchema } from '@/lib/userSchema'
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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2, Edit3, Save, Mail, Phone, MapPin, User as UserIcon, Lock, AlignLeft, CheckCircle2 } from "lucide-react"

function EditUser({ userId, open, setOpen }) {

  const { data: user, isLoading: isFetching } = useGetUser(userId);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        phone: user.phone,
        email: user.email || '',
        address: user.address || '',
        description: user.description || '',
        active: user.active,
        password: user.password || '',

      });
    }
  }, [user, reset]);

  const activeValue = watch("active");

  const editMutation = useEditUser(() => {
    setOpen(false);
  });

  const onSubmit = (values) => {
    editMutation.mutate({ ...values, id: userId });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-187.5 font-cairo p-8 overflow-y-auto max-h-[90vh]" dir="rtl">
        {isFetching ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-stone-500" size={40} />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader className="text-right mb-4">
              <DialogTitle className="text-2xl font-bold text-stone-900 flex items-center gap-2 font-cairo">
                <div className="bg-amber-50 p-2 rounded-lg text-amber-600">
                  <Edit3 size={24} />
                </div>
                تعديل بيانات المشترك
              </DialogTitle>
              <DialogDescription className="text-stone-500 mt-2 text-base font-cairo">
                أنت الآن تقوم بتعديل بيانات الحساب الخاص بـ <span className="font-bold text-stone-800">{user?.name}</span>.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4 font-cairo text-right">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label className="font-bold text-stone-700 flex items-center gap-2">
                    <UserIcon size={14} className="text-stone-400" /> الاسم بالكامل
                  </Label>
                  <Input {...register("name")} className={`rounded-xl h-11 ${errors.name ? 'border-red-500' : 'border-stone-200'}`} />
                  {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                </div>
                <div className="grid gap-2">
                  <Label className="font-bold text-stone-700 flex items-center gap-2">
                    <Phone size={14} className="text-stone-400" /> رقم الهاتف
                  </Label>
                  <Input {...register("phone")} dir="ltr" className={`text-right rounded-xl h-11 ${errors.phone ? 'border-red-500' : 'border-stone-200'}`} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label className="font-bold text-stone-700 flex items-center gap-2">
                    <Mail size={14} className="text-stone-400" /> البريد الإلكتروني
                  </Label>
                  <Input {...register("email")} dir="ltr" className="text-right border-stone-200 rounded-xl h-11" />
                </div>
                <div className="grid gap-2">
                  <Label className="font-bol flex items-center gap-2 text-stone-700">
                    <Lock size={14} /> كلمة مرور جديدة (اختياري)
                  </Label>
                  <Input type="text" {...register("password")} placeholder="اتركه فارغاً للحفاظ على الحالية" className="text-right border-stone-200 rounded-xl h-11" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="grid gap-2">
                  <Label className="font-bold text-stone-700 flex items-center gap-2">
                    <MapPin size={14} className="text-stone-400" /> العنوان
                  </Label>
                  <Input {...register("address")} className="border-stone-200 rounded-xl h-11" />
                </div>

                <div className="flex items-center justify-between border border-stone-200 rounded-xl h-11 px-4 bg-stone-50/50">
                  <Label className="font-bold text-stone-700 cursor-pointer flex items-center gap-2 text-sm">
                    <CheckCircle2 size={16} className={activeValue ? "text-green-500" : "text-stone-400"} />
                    حالة الحساب: {activeValue ? 'نشط' : 'معطل'}
                  </Label>
                  <Switch
                    checked={!!activeValue}
                    onCheckedChange={(val) => setValue("active", val)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="font-bold text-stone-700 flex items-center gap-2">
                  <AlignLeft size={14} className="text-stone-400" /> الملاحظات
                </Label>
                <Textarea {...register("description")} className="border-stone-200 rounded-xl min-h-20 resize-none" />
              </div>
            </div>

            <DialogFooter className="flex-row-reverse gap-3 mt-6">
              <button
                type="submit"
                disabled={editMutation.isPending}
                className="flex-2 bg-stone-900 text-white py-3.5 rounded-xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98] disabled:opacity-70"
              >
                {editMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                <span>حفظ التعديلات</span>
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 px-6 py-3.5 border border-stone-200 rounded-xl text-stone-600 font-bold hover:bg-stone-50 transition-colors"
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

export default EditUser;