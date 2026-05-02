import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Ticket, Loader2, Calendar, User, Wifi, MapPin } from "lucide-react";
import { permissionEmployeeSchema } from "@/lib/permissionEmployeeSchema";
import { useAddPermissionEmployee } from "@/api/permissionEmployee";
import { useGetEmployees } from "@/api/employee";
import { useGetPermissions } from "@/api/permission";

function CreatePermissionEmployee({ open, setOpen, userId, userRole }) {

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(permissionEmployeeSchema),
    defaultValues: {
      employee_id: "",
      permission_id: "",

    }
  });

  // Mutations & Queries
  const addMutation = useAddPermissionEmployee(() => {
    setOpen(false);
    reset();
  });

  const { data: employeesData, isLoading: isLoadingEmployees } = useGetEmployees(1, 10, userId, userRole);
  const { data: permissionsData } = useGetPermissions(1, 100, userId, userRole);

  console.log("Check Props:", { userId, userRole, employeesData });

  const onSubmit = (values) => {
    addMutation.mutate({
      ...values,
      user_id: userId,
      employee_id: Number(values.employee_id),
      permission_id: Number(values.permission_id),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-160 font-cairo p-11 rounded-[32px] max-h-[95vh] overflow-y-auto" dir="rtl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-right mb-8">
            <DialogTitle className="text-2xl font-black text-stone-900 flex items-center gap-3">
              <div className="bg-stone-100 p-2.5 rounded-2xl text-blue-600">
                <Ticket size={24} />
              </div>
              <span style={{ fontFamily: "cairo" }}>تفعيل صلاحية جديد</span>
            </DialogTitle>
            <DialogDescription className="text-stone-500 font-bold">
              قم بتعبئة البيانات لربط الموظف بالصلاحية .
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 font-cairo">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 flex items-center gap-2 mr-1">
                  <User size={16} className="text-stone-400" /> الموظف  *
                </Label>
                <Select
                  onValueChange={(v) => setValue("employee_id", Number(v), { shouldValidate: true })}
                  value={watch("employee_id")?.toString()}
                >
                  <SelectTrigger className="rounded-2xl h-12 border-stone-200 bg-white focus:ring-2 focus:ring-stone-100 transition-all">
                    <SelectValue placeholder="اختر الموظف..." />
                  </SelectTrigger>
                  <SelectContent dir="rtl" className="font-cairo rounded-2xl shadow-xl border-stone-100">
                    {employeesData?.items?.map(c => (
                      <SelectItem key={c.id} value={c.id.toString()} className="cursor-pointer py-2.5">
                        {c.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.employee_id && <span className="text-[13px] font-bold text-red-500 mr-1">⚠️ {errors.employee_id.message}</span>}
              </div>

              <div className="grid gap-2 text-right">
                <Label className="font-bold text-stone-700 flex items-center gap-2 mr-1">
                  <Wifi size={16} className="text-stone-400" />  الصلاحية *
                </Label>
                <Select
                  onValueChange={(v) => setValue("permission_id", Number(v), { shouldValidate: true })}
                  value={watch("permission_id")?.toString()}
                >
                  <SelectTrigger className="rounded-2xl h-12 border-stone-200 bg-white focus:ring-2 focus:ring-stone-100">
                    <SelectValue placeholder="اختر الصلاحية" />
                  </SelectTrigger>
                  <SelectContent dir="rtl" className="font-cairo rounded-2xl shadow-xl">
                    {permissionsData?.items?.map(p => (
                      <SelectItem key={p.id} value={p.id.toString()} className="cursor-pointer py-2.5">
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.permission_id && <span className="text-[13px] font-bold text-red-500 mr-1">⚠️ {errors.permission_id.message}</span>}
              </div>
            </div>

          </div>

          <DialogFooter className="mt-10 flex gap-3">
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="flex-1 bg-stone-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-all disabled:opacity-50"
            >
              {addMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              تأكيد التفعيل
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 border border-stone-200 py-4 rounded-2xl font-bold text-stone-600 hover:bg-stone-50 transition-all"
            >
              إلغاء
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePermissionEmployee;