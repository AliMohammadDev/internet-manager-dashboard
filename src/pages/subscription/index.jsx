import React, { useState } from "react";
import {
  Ticket, Plus, CalendarClock, CreditCard, Activity, Search,
  ArrowUpRight, MoreVertical, Edit, Trash2, Loader2, User, Wifi
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useGetSubscriptions } from "@/api/subscription";
import CreateSubscription from "./CreateSubscription";
import EditSubscription from "./EditSubscription";
import DeleteSubscription from "./DeleteSubscription";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";

function Subscription() {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [deleteSubscriptionId, setDeleteSubscriptionId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const cookies = Cookie();
  const token = cookies.get("token");
  let userId = null;
  let userRole = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.userId;
      userRole = decoded.role;
    } catch (error) {
      console.error(error);
    }
  }

  const { data: response, isLoading } = useGetSubscriptions(1, 10, userId, userRole);
  const subscriptions = response?.items || [];


  return (
    <div className="space-y-6 font-cairo text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">اشتراكات المستخدمين</h1>
          <p className="text-stone-500 mt-1">إدارة عمليات التجديد ومراقبة الحسابات النشطة.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-stone-800 transition-all font-bold shadow-sm cursor-pointer"
        >
          <Plus size={20} />
          <span>تجديد اشتراك يدوي</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Activity size={24} /></div>
          <div><p className="text-sm text-stone-500 font-bold">الاشتراكات الفعالة</p><p className="text-2xl font-black">{response?.meta?.total || 0}</p></div>
        </div>
        <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><CalendarClock size={24} /></div>
          <div><p className="text-sm text-stone-500 font-bold">تنتهي اليوم</p><p className="text-2xl font-black">--</p></div>
        </div>
        <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><CreditCard size={24} /></div>
          <div><p className="text-sm text-stone-500 font-bold">تحصيلات النظام</p><p className="text-2xl font-black">قيد الحساب</p></div>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input type="text" placeholder="ابحث برقم المشترك أو اسم المستخدم..." className="w-full p-3 pr-10 border border-stone-200 rounded-2xl bg-white focus:ring-2 focus:ring-stone-100 outline-none" />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-stone-200 rounded-[28px] shadow-sm overflow-hidden min-h-100">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-100 text-stone-400 gap-2">
            <Loader2 className="animate-spin" size={40} />
            <p>جاري جلب الاشتراكات...</p>
          </div>
        ) : subscriptions.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-stone-50/50">
                <TableRow>
                  <TableHead className="text-right p-5">المشترك</TableHead>
                  <TableHead className="text-right p-5">الباقة</TableHead>
                  <TableHead className="text-right p-5">تاريخ الانتهاء</TableHead>
                  <TableHead className="text-right p-5">الحالة</TableHead>
                  <TableHead className="text-left p-5">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => (
                  <TableRow key={sub.id} className="group hover:bg-stone-50/50 transition-colors">
                    <TableCell className="p-5 font-bold">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-stone-400" />
                        {sub.customer?.name}
                      </div>
                    </TableCell>
                    <TableCell className="p-5">
                      <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 w-fit px-3 py-1 rounded-lg text-xs font-black">
                        <Wifi size={14} /> {sub.plan?.name}
                      </div>
                    </TableCell>
                    <TableCell className="p-5 font-medium text-stone-600">{sub.end_date}</TableCell>
                    <TableCell className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-black ${sub.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {sub.active ? "نشط" : "متوقف"}
                      </span>
                    </TableCell>
                    <TableCell className="p-5 text-left">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 hover:bg-stone-100 rounded-lg outline-none">
                          <MoreVertical size={18} className="text-stone-400" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48 font-cairo text-right rounded-2xl p-2 shadow-xl border-stone-100">
                          <DropdownMenuItem
                            onClick={() => { setSelectedSubscriptionId(sub.id); setIsEditOpen(true); }}
                            className="flex items-center justify-end gap-2 cursor-pointer py-2.5 rounded-xl focus:bg-stone-50"
                          >
                            <span>تعديل البيانات</span>
                            <Edit size={16} className="text-blue-500" />
                          </DropdownMenuItem>
                          <div className="h-px bg-stone-100 my-1" />
                          <DropdownMenuItem
                            onClick={() => { setDeleteSubscriptionId(sub.id); setIsDeleteOpen(true); }}
                            className="flex items-center justify-end gap-2 cursor-pointer text-red-600 py-2.5 rounded-xl focus:bg-red-50 focus:text-red-600"
                          >
                            <span>حذف البيانات</span>
                            <Trash2 size={16} />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-300">
              <Ticket size={40} />
            </div>
            <div className="max-w-sm">
              <h3 className="text-xl font-bold text-stone-900">سجل الاشتراكات</h3>
              <p className="text-stone-500 mt-2">لا توجد عمليات تجديد حالية بعد.</p>
            </div>
            <button onClick={() => setIsAddOpen(true)} className="text-black font-bold flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
              إضافة أول اشتراك الآن <ArrowUpRight size={18} />
            </button>
          </div>
        )}
      </div>

      <CreateSubscription
        open={isAddOpen}
        setOpen={setIsAddOpen}
        userId={userId}
        userRole={userRole}
      />

      <EditSubscription
        pointId={selectedSubscriptionId}
        open={isEditOpen}
        setOpen={setIsEditOpen}
        userId={userId}
        userRole={userRole} />

      <DeleteSubscription
        pointId={deleteSubscriptionId}
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
        userId={userId}
        userRole={userRole} />

    </div>
  );
}

export default Subscription;