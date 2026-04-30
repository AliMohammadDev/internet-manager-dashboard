import React, { useState } from 'react'
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAddUser } from '@/api/user'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2, UserPlus, Save, Mail, Phone, MapPin, User as UserIcon, Lock, AlignLeft, CheckCircle2 } from "lucide-react"
import { userSchema } from '@/lib/userSchema'
import { ShieldCheck } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


function CreateUser() {
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, setValue, watch, control, reset, formState: { errors } } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      description: "",
      active: true,
      role: "user"
    }
  });

  const activeValue = watch("active");

  const addUserMutation = useAddUser(() => {
    setOpen(false);
    reset();
  });

  const onSubmit = (values) => {
    addUserMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-stone-900 text-white px-5 py-2.5 rounded-xl hover:bg-stone-800 transition-all shadow-sm active:scale-95 font-bold font-cairo cursor-pointer">
          <UserPlus size={18} />
          <span>إنشاء حساب جديد</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-187.5 font-cairo p-10 overflow-y-auto max-h-[90vh]" dir="rtl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-right mb-4">
            <DialogTitle className="text-2xl font-bold text-stone-900 flex items-center gap-2 font-cairo">
              <div className="bg-stone-100 p-2 rounded-lg">
                <UserPlus size={24} className="text-blue-600" />
              </div>
              إضافة مشترك جديد
            </DialogTitle>
            <DialogDescription className="text-stone-500 mt-2 text-base font-cairo">
              يرجى ملء البيانات التالية. الحقول التي تحتوي على (*) مطلوبة.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4 font-cairo">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 flex items-center gap-2">
                  <UserIcon size={14} /> اسم المشترك *
                </Label>
                <Input
                  {...register("name")}
                  placeholder="أدخل الاسم الثلاثي"
                  className={`rounded-xl h-11 ${errors.name ? 'border-red-500' : 'border-stone-200'}`} />
                {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
              </div>
              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 flex items-center gap-2">
                  <Phone size={14} /> رقم الهاتف *
                </Label>
                <Input
                  {...register("phone")}
                  dir="ltr"
                  placeholder="09xxxxxxx"
                  className={`text-right rounded-xl h-11 
                  ${errors.phone ? 'border-red-500' : 'border-stone-200'}`} />
                {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 flex items-center gap-2">
                  <Mail size={14} /> البريد الإلكتروني
                </Label>
                <Input
                  {...register("email")}
                  dir="ltr"
                  placeholder="name@example.com"
                  className="text-right border-stone-200 rounded-xl h-11" />
                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
              </div>
              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 flex items-center gap-2">
                  <Lock size={14} /> كلمة المرور *
                </Label>
                <Input type="password" {...register("password")} placeholder="••••••••" className={`text-right rounded-xl h-11 ${errors.password ? 'border-red-500' : 'border-stone-200'}`} />
                {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">

              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 flex items-center gap-2">
                  <MapPin size={14} /> العنوان
                </Label>
                <Input {...register("address")} placeholder="المدينة، الحي" className="border-stone-200 rounded-xl h-11" />
              </div>


              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 flex items-center gap-2">
                  <ShieldCheck size={14} /> الدور
                </Label>
                <Controller
                  control={control}
                  name="role"
                  defaultValue="user"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="rounded-xl h-11 border-stone-200 focus:ring-stone-400">
                        <SelectValue placeholder="اختر الدور" />
                      </SelectTrigger>
                      <SelectContent className="font-cairo">
                        <SelectItem value="user">مستخدم عادي</SelectItem>
                        <SelectItem value="admin">مدير نظام</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="flex items-center justify-between border border-stone-200 rounded-xl h-11 px-4 bg-stone-50/50">
                <Label className="font-bold text-stone-700 cursor-pointer flex items-center gap-2">
                  <CheckCircle2 size={16}
                    className={`${activeValue ? 'text-green-500' : 'text-stone-300'} transition-colors`}
                  /> تفعيل الحساب
                </Label>
                <Switch
                  checked={activeValue}
                  onCheckedChange={(val) => setValue("active", val)}
                  className="data-[state=checked]:bg-green-600"
                />
              </div>
            </div>

            <div className="grid gap-2 text-right">
              <Label className="font-bold text-stone-700 flex items-center gap-2">
                <AlignLeft size={14} /> ملاحظات إضافية
              </Label>
              <Textarea {...register("description")} placeholder="أضف أي تفاصيل هنا..." className="border-stone-200 rounded-xl min-h-20 resize-none" />
              {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
            </div>
          </div>

          <DialogFooter className="flex-row-reverse gap-3 mt-6">
            <button
              type="submit"
              disabled={addUserMutation.isPending}
              className="flex-2 bg-stone-900 text-white py-3.5 rounded-xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {addUserMutation.isPending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              <span>{addUserMutation.isPending ? "جاري الحفظ..." : "حفظ بيانات المشترك"}</span>
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 px-6 py-3.5 border border-stone-200 rounded-xl text-stone-600 font-bold hover:bg-stone-100 transition-colors"
            >
              إلغاء
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateUser   