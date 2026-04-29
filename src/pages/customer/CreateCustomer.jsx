import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, UserPlus, Phone, Loader2 } from "lucide-react";
import { useAddCustomer } from "@/api/customer";
import { useGetNetworks } from "@/api/network";
import { useGetPoints } from "@/api/point";
import { customerSchema } from "@/lib/customerSchema";
import { Info } from "lucide-react";
import { useGetPlans } from "@/api/plan";


function CreateCustomer({ setOpen, open, userId, userRole }) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues:
    {
      active: true,
      name: "",
      phone: "",
      plan_id: "",
      point_id: "",
      network_id: ""
    }
  });

  const activeValue = watch("active");
  const addMutation = useAddCustomer(() => { setOpen(false); reset(); });

  const { data: networksData } = useGetNetworks(1, 100, userId, userRole);
  const { data: pointsData } = useGetPoints(1, 100, userId, userRole);
  const { data: planData } = useGetPlans(1, 100, userId, userRole);

  const onSubmit = (values) => {
    addMutation.mutate({ ...values, user_id: userId });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-2xl hover:bg-stone-800 transition-all font-bold font-cairo">
          <UserPlus size={20} />
          <span>إضافة زبون جديد</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-150 font-cairo p-11 rounded-[32px] max-h-[95vh] overflow-y-auto" dir="rtl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-right mb-6">
            <DialogTitle className="text-2xl font-black text-stone-900 flex items-center gap-3">
              <div className="bg-stone-100 p-2.5 rounded-2xl text-stone-700"><UserPlus size={24} /></div>
              <span style={{ fontFamily: 'cairo' }}>إضافة زبون جديد</span>
            </DialogTitle>
            <DialogDescription className="text-stone-500 font-bold">أدخل بيانات الزبون لربطه بالشبكة والنقطة المناسبة.</DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="grid gap-2 text-right">
              <Label className="font-bold text-stone-700">اسم الزبون الكامل *</Label>
              <Input {...register("name")} placeholder="اسم الزبون" className="rounded-2xl h-12" />
              {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700">رقم الهاتف *</Label>
                <div className="relative">
                  <Phone size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <Input {...register("phone")} placeholder="05xxxxxxxx" className="pr-10 rounded-2xl h-12" />
                </div>
                {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
              </div>

              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700">الشبكة *</Label>
                <Select onValueChange={(v) => setValue("network_id", Number(v))}>
                  <SelectTrigger className="rounded-2xl h-12"><SelectValue placeholder="اختر الشبكة" /></SelectTrigger>
                  <SelectContent dir="rtl">
                    {networksData?.items?.map(net => <SelectItem key={net.id} value={net.id.toString()}>{net.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700">نقطة التوزيع *</Label>
                <Select onValueChange={(v) => setValue("point_id", Number(v))}>
                  <SelectTrigger className="rounded-2xl h-12"><SelectValue placeholder="اختر النقطة" /></SelectTrigger>
                  <SelectContent dir="rtl">
                    {pointsData?.items?.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700"> الخطه المختارة *</Label>
                <Select onValueChange={(v) => setValue("plan_id", Number(v))}>
                  <SelectTrigger className="rounded-2xl h-12"><SelectValue placeholder="اختر الخطة" /></SelectTrigger>
                  <SelectContent dir="rtl">
                    {planData?.items?.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

            </div>

            <div className="flex items-center justify-between border border-stone-100 rounded-2xl h-14 px-5 bg-stone-50/50 mt-2 transition-all hover:bg-stone-50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeValue ? 'bg-green-100 text-green-600' : 'bg-stone-200 text-stone-500'}`}>
                  <Info size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-stone-800 text-sm">حالة الحساب</span>
                  <span className="text-xs text-stone-400">تفعيل فوري</span>
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
              حفظ الزبون
            </button>
            <button type="button" onClick={() => setOpen(false)} className="flex-1 border border-stone-200 py-4 rounded-2xl font-bold text-stone-600">إلغاء</button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCustomer;