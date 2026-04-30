import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, UserPlus, Mail, Lock, Loader2, Info, Fingerprint } from "lucide-react";
import { useAddEmployee } from "@/api/employee";
import { employeeSchema } from "@/lib/employeeSchema";

function CreateEmployee({ setOpen, open, userId, userRole }) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      active: true,
      full_name: "",
      email: "",
      password: "",
      user_id: userId || "",
    }
  });

  const activeValue = watch("active");
  const addMutation = useAddEmployee(() => { setOpen(false); reset(); });

  const onSubmit = (values) => {
    addMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-150 font-cairo p-11 rounded-[32px] max-h-[95vh] overflow-y-auto" dir="rtl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-right mb-6">
            <DialogTitle className="text-2xl font-black text-stone-900 flex items-center gap-3">
              <div className="bg-blue-50 p-2.5 rounded-2xl text-blue-600">
                <UserPlus size={24} />
              </div>
              <span style={{ fontFamily: 'cairo' }}>إضافة موظف جديد</span>
            </DialogTitle>
            <DialogDescription className="text-stone-500 font-bold font-cairo">قم بإنشاء حساب موظف جديد وتعيين صلاحيات الدخول.</DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="grid gap-2 text-right">
              <Label className="font-bold text-stone-700">الاسم الكامل للموظف *</Label>
              <div className="relative">
                <Input {...register("full_name")} placeholder="مثال: محمد أحمد" className="rounded-2xl h-12 pr-10" />
                <UserPlus size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
              </div>
              {errors.full_name && <span className="text-[13px] font-bold text-red-500 mr-1">⚠️ {errors.full_name.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700">البريد الإلكتروني *</Label>
                <div className="relative">
                  <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <Input {...register("email")} type="email" placeholder="email@example.com" className="pr-10 rounded-2xl h-12" />
                </div>
                {errors.email && <span className="text-[13px] font-bold text-red-500 mr-1">⚠️ {errors.email.message}</span>}
              </div>

              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700">كلمة المرور *</Label>
                <div className="relative">
                  <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <Input {...register("password")} type="password" placeholder="••••••••" className="pr-10 rounded-2xl h-12" />
                </div>
                {errors.password && <span className="text-[13px] font-bold text-red-500 mr-1">⚠️ {errors.password.message}</span>}
              </div>
            </div>

            <div className="flex items-center justify-between border border-stone-100 rounded-2xl h-14 px-5 bg-stone-50/50 mt-2 hover:bg-stone-50 transition-all">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeValue ? 'bg-green-100 text-green-600' : 'bg-stone-200 text-stone-500'}`}>
                  <Info size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-stone-800 text-sm">حالة الحساب</span>
                  <span className="text-xs text-stone-400 font-medium">تفعيل الدخول فوراً</span>
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
            <button type="submit" disabled={addMutation.isPending} className="flex-1 bg-stone-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-stone-100">
              {addMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              حفظ بيانات الموظف
            </button>
            <button type="button" onClick={() => setOpen(false)} className="flex-1 border border-stone-200 py-4 rounded-2xl font-bold text-stone-600 hover:bg-stone-50">إلغاء</button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateEmployee;