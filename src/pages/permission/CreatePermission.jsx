import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, ShieldPlus, Key, Loader2, Info, FileText } from "lucide-react";
import { useAddPermission } from "@/api/permission";
import { permissionSchema } from "@/lib/permissionSchema";

function CreatePermission({ open, setOpen, userId, userRole }) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(permissionSchema),
    defaultValues: { active: true, name: "", description: "" }
  });

  const activeValue = watch("active");
  const addMutation = useAddPermission(() => { setOpen(false); reset(); });

  const onSubmit = (values) => {
    addMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>

      <DialogContent className="sm:max-w-150 font-cairo p-11 rounded-[32px] max-h-[95vh] overflow-y-auto" dir="rtl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-right mb-6">
            <DialogTitle className="text-2xl font-black text-stone-900 flex items-center gap-3">
              <div className="bg-stone-100 p-2.5 rounded-2xl text-stone-700">
                <Key size={24} />
              </div>
              <span style={{ fontFamily: 'cairo' }}>إنشاء صلاحية نظام</span>
            </DialogTitle>
            <DialogDescription className="text-stone-500 font-bold">قم بتعريف رمز الصلاحية الجديد ووصف مهامها.</DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="grid gap-2 text-right">
              <Label className="font-bold text-stone-700">رمز الصلاحية (Key) *</Label>
              <div className="relative">
                <Input {...register("name")} placeholder="مثال: CAN_DELETE_USER" className="rounded-2xl h-12 uppercase font-mono" />
              </div>
              {errors.name && <span className="text-[13px] font-bold text-red-500 mr-1">⚠️ {errors.name.message}</span>}
            </div>

            <div className="grid gap-2 text-right">
              <Label className="font-bold text-stone-700">وصف الصلاحية *</Label>
              <div className="relative">
                <Input {...register("description")} placeholder="ماذا تسمح هذه الصلاحية للمستخدم بفعله؟" className="rounded-2xl h-12" />
              </div>
              {errors.description && <span className="text-[13px] font-bold text-red-500 mr-1">⚠️ {errors.description.message}</span>}
            </div>

            <div className="flex items-center justify-between border border-stone-100 rounded-2xl h-14 px-5 bg-stone-50/50 mt-2 transition-all hover:bg-stone-50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeValue ? 'bg-green-100 text-green-600' : 'bg-stone-200 text-stone-500'}`}>
                  <Info size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-stone-800 text-sm">حالة الصلاحية</span>
                  <span className="text-xs text-stone-400">تفعيل فوري في النظام</span>
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
            <button type="submit" disabled={addMutation.isPending} className="flex-1 bg-stone-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2">
              {addMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              حفظ الصلاحية
            </button>
            <button type="button" onClick={() => setOpen(false)} className="flex-1 border border-stone-200 py-4 rounded-2xl font-bold text-stone-600">إلغاء</button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePermission;