import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Save, Plus, MapPin, Signal, Loader2, Info, Network, NotebookPen } from "lucide-react";
import { useAddPoint } from "@/api/point";
import { useGetNetworks } from "@/api/network";
import pointSchema from "@/lib/pointSchema";


function CreatePoint({ setOpen, open, userId, userRole }) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(pointSchema),
    defaultValues: {
      active: true,
      user_id: userId,
      name: "",
      max_subscription: 100,
      count_subscription: 0,
      notes: "",
      network_id: ""
    }
  });

  const activeValue = watch("active");
  const networkIdValue = watch("network_id");

  const addMutation = useAddPoint(() => {
    setOpen(false);
    reset();
  });


  const { data: networksData, isLoading: isLoadingNetworks } = useGetNetworks(1, 50, userId, userRole);
  const networks = networksData?.items || [];

  const onSubmit = (values) => {
    const finalData = {
      ...values,
      user_id: userId
    };
    addMutation.mutate(finalData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-2xl hover:bg-stone-800 transition-all shadow-md active:scale-95 font-bold font-cairo">
          <Plus size={20} />
          <span>إضافة نقطة جديدة</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-150 font-cairo p-8 rounded-[32px] max-h-[95vh] overflow-y-auto" dir="rtl">

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-right mb-6">
            <DialogTitle className="text-2xl font-black text-stone-900 flex items-center gap-3">
              <div className="bg-stone-100 p-2.5 rounded-2xl text-stone-700">
                <Signal size={24} />
              </div>
              <span style={{ fontFamily: 'Cairo' }}>تأسيس نقطة توزيع</span>
            </DialogTitle>
            <DialogDescription className="text-stone-500 font-bold">
              أدخل بيانات النقطة الفنية لربطها بالشبكة المختارة.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">


            <div className="grid gap-2 text-right">
              <Label className="font-bold text-stone-700 mr-1">الموقع الجغرافي *</Label>
              <div className="relative">
                <MapPin size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <Input
                  {...register("location")}
                  placeholder="مثال: دبي - البرج الشمالي"
                  className={`pr-10 rounded-2xl h-12 ${errors.location ? 'border-red-500' : 'border-stone-200'}`}
                />
              </div>
              {errors.location && <span className="text-xs text-red-500">{errors.location.message}</span>}
            </div>

            <div className="grid grid-cols-3 gap-4">

              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 mr-1 flex items-center gap-2">
                  <Network size={16} /> الشبكة التابعة لها *
                </Label>
                <Select
                  onValueChange={(val) => setValue("network_id", Number(val))}
                  value={networkIdValue?.toString()}
                >
                  <SelectTrigger className="rounded-2xl h-12 border-stone-200">
                    <SelectValue placeholder={isLoadingNetworks ? "جاري تحميل الشبكات..." : "اختر الشبكة"} />
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

              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 text-xs mr-1">اسم النقطة *</Label>
                <Input
                  type="text"
                  {...register("name")}
                  placeholder="مثال: نقطة حي السلام"
                  className={`rounded-2xl h-12 ${errors.name ? 'border-red-500' : 'border-stone-200'}`}
                />
                {errors.name && <span className="text-[10px] text-red-500">{errors.name.message}</span>}
              </div>

              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 text-xs mr-1">أقصى مشتركين</Label>
                <Input type="number" {...register("max_subscription")} className="rounded-2xl h-12" />
              </div>

            </div>

            <div className="grid gap-2 text-right">
              <Label className="font-bold text-stone-700 mr-1 flex items-center gap-2">
                <NotebookPen size={16} /> ملاحظات إضافية
              </Label>
              <Textarea
                {...register("notes")}
                placeholder="أدخل أي تفاصيل فنية إضافية هنا..."
                className="rounded-2xl border-stone-200 min-h-24 transition-all focus:ring-stone-900"
              />
            </div>

            <div className="flex items-center justify-between border border-stone-100 rounded-2xl h-14 px-5 bg-stone-50/50 mt-2 transition-all hover:bg-stone-50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeValue ? 'bg-green-100 text-green-600' : 'bg-stone-200 text-stone-500'}`}>
                  <Info size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-stone-800 text-sm">حالة البث</span>
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

export default CreatePoint;