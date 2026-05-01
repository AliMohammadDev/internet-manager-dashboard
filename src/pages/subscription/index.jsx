import React, { useState } from "react";
import {
  Ticket, Plus, CalendarClock, CreditCard, Activity, Search, MoreVertical, Edit, Trash2, Loader2, User, Wifi, MapPin, Calendar, Filter
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useGetSubscriptions, useGetSubscriptionStatistics } from "@/api/subscription";
import CreateSubscription from "./CreateSubscription";
import EditSubscription from "./EditSubscription";
import DeleteSubscription from "./DeleteSubscription";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";

function Subscription() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteSubscriptionId, setDeleteSubscriptionId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: stats, isLoading: isLoadingStats } = useGetSubscriptionStatistics();
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

  const { data: response, isLoading, isError } = useGetSubscriptions(page, 5, userId, userRole);

  const subscriptions = response?.items || [];
  const meta = response?.meta || { total_pages: 0, current_page: 1, total: 0 };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const customerName = sub.customer?.name || "";
    const planName = sub.plan?.name || "";

    const matchesSearch =
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      planName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true :
        statusFilter === "active" ? sub.active === true :
          sub.active === false;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-cairo text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">اشتراكات المستخدمين</h1>
          <p className="text-stone-500 mt-1">إدارة عمليات التجديد ومراقبة الحسابات النشطة في النظام.</p>
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* إجمالي الاشتراكات */}
        <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm flex items-center gap-4 transition-all hover:border-blue-200">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Ticket size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-bold">إجمالي الاشتراكات</p>
            {isLoadingStats ? (
              <Loader2 className="animate-spin text-stone-300 size-5 mt-1" />
            ) : (
              <p className="text-2xl font-black text-stone-900">{stats?.totalSubscriptions || 0}</p>
            )}
          </div>
        </div>

        {/* الاشتراكات النشطة */}
        <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm flex items-center gap-4 transition-all hover:border-emerald-200">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-bold">الاشتراكات النشطة</p>
            {isLoadingStats ? (
              <Loader2 className="animate-spin text-stone-300 size-5 mt-1" />
            ) : (
              <p className="text-2xl font-black text-emerald-600">{stats?.activeSubscriptions || 0}</p>
            )}
          </div>
        </div>

        {/* الاشتراكات غير النشطة */}
        <div className="p-5 bg-white border border-stone-200 rounded-2xl shadow-sm flex items-center gap-4 transition-all hover:border-red-200">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
            <CalendarClock size={24} className="opacity-70" />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-bold">اشتراكات متوقفة</p>
            {isLoadingStats ? (
              <Loader2 className="animate-spin text-stone-300 size-5 mt-1" />
            ) : (
              <p className="text-2xl font-black text-red-600">{stats?.inactiveSubscriptions || 0}</p>
            )}
          </div>
        </div>

      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input
            type="text"
            placeholder="ابحث باسم الزبون أو اسم الباقة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pr-10 border border-stone-200 rounded-xl bg-white focus:ring-2 focus:ring-stone-100 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-3 min-w-50 shadow-sm">
          <Filter size={18} className="text-stone-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-0 focus:ring-0 font-cairo text-stone-600 shadow-none w-full bg-transparent">
              <SelectValue placeholder="حالة الاشتراك" />
            </SelectTrigger>
            <SelectContent className="font-cairo text-right" dir="rtl">
              <SelectItem value="all">جميع الاشتراكات</SelectItem>
              <SelectItem value="active">نشط فقط</SelectItem>
              <SelectItem value="inactive">متوقف</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-24 flex flex-col items-center justify-center text-stone-400 gap-2">
            <Loader2 className="animate-spin" size={40} />
            <p>جاري تحميل سجلات الاشتراكات...</p>
          </div>
        ) : isError ? (
          <div className="p-24 text-center text-red-500 font-bold">حدث خطأ أثناء جلب البيانات.</div>
        ) : filteredSubscriptions.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-stone-50/50 text-right">
                  <TableRow>
                    <TableHead className="text-center font-bold text-stone-800 p-4 w-12">#</TableHead>
                    <TableHead className="text-right p-5">المشترك</TableHead>
                    <TableHead className="text-right p-5">الباقة</TableHead>
                    <TableHead className="text-right p-5">السعر</TableHead>
                    <TableHead className="text-right p-5">نقطة التوزيع</TableHead>
                    <TableHead className="text-right p-5">تاريخ الانتهاء</TableHead>
                    <TableHead className="text-right p-5">الحالة</TableHead>
                    <TableHead className="text-left p-5">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscriptions.map((sub, index) => (
                    <TableRow key={sub.id} className="group hover:bg-stone-50/40 transition-colors">

                      <TableCell className="p-4 text-center font-medium text-stone-900 w-10">
                        {index + 1}
                      </TableCell>

                      <TableCell className="p-5">
                        <div className="flex items-center gap-2 font-bold text-stone-900">
                          <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 group-hover:bg-black group-hover:text-white transition-all">
                            <User size={14} />
                          </div>
                          {sub.customer?.name}
                        </div>
                      </TableCell>
                      <TableCell className="p-5">
                        <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 w-fit px-3 py-1 rounded-lg text-[11px] font-black font-cairo">
                          <Wifi size={13} /> {sub.plan?.name}
                        </div>
                      </TableCell>
                      <TableCell className="p-5">
                        <div className="font-bold text-green-900 flex items-center gap-1">
                          <span className="text-sm">{sub.plan?.price?.toLocaleString()}</span>
                          <span className="text-[10px] text-green-900 font-medium">$</span>
                        </div>
                      </TableCell>
                      <TableCell className="p-5">
                        <div className="flex items-center gap-1.5 text-sm text-stone-600">
                          <MapPin size={14} className="text-stone-400" /> {sub.point?.name}
                        </div>
                      </TableCell>
                      <TableCell className="p-5">
                        <div className="flex items-center gap-1.5 text-sm text-stone-600 font-medium">
                          <Calendar size={14} className="text-stone-400" /> {sub.end_date}
                        </div>
                      </TableCell>
                      <TableCell className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${sub.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {sub.active ? "نشط" : "متوقف"}
                        </span>
                      </TableCell>
                      <TableCell className="p-5 text-left">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-2 hover:bg-stone-100 rounded-lg outline-none transition-colors">
                            <MoreVertical size={18} className="text-stone-400" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-48 font-cairo text-right rounded-xl p-2 shadow-xl border-stone-100">
                            <DropdownMenuItem
                              onClick={() => { setSelectedSubscriptionId(sub.id); setIsEditOpen(true); }}
                              className="flex items-center justify-end gap-2 cursor-pointer py-2.5 rounded-lg focus:bg-blue-50 focus:text-blue-600"
                            >
                              <span>تعديل الاشتراك</span>
                              <Edit size={16} className="text-blue-500" />
                            </DropdownMenuItem>
                            <div className="h-px bg-stone-100 my-1" />
                            <DropdownMenuItem
                              onClick={() => { setDeleteSubscriptionId(sub.id); setIsDeleteOpen(true); }}
                              className="flex items-center justify-end gap-2 cursor-pointer text-red-600 py-2.5 rounded-lg focus:bg-red-50 focus:text-red-600"
                            >
                              <span>حذف السجل</span>
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

            {/* Pagination */}
            <div className="p-4 border-t border-stone-100 bg-stone-50/30 flex flex-col items-center gap-3">
              <Pagination>
                <PaginationContent className="flex-row-reverse gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      label="السابق"
                      onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
                      className={page === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer hover:bg-white shadow-sm"}
                    />
                  </PaginationItem>

                  {[...Array(meta.total_pages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={page === i + 1}
                        onClick={(e) => { e.preventDefault(); setPage(i + 1); }}
                        className="cursor-pointer rounded-lg"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      label="التالي"
                      onClick={(e) => { e.preventDefault(); if (page < meta.total_pages) setPage(page + 1); }}
                      className={page === meta.total_pages ? "opacity-50 pointer-events-none" : "cursor-pointer hover:bg-white shadow-sm"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <div className="text-xs text-stone-400 font-medium">
                إظهار {filteredSubscriptions.length} من أصل {meta.total} اشتراك
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
            <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-300">
              <Ticket size={40} />
            </div>
            <div className="max-w-sm">
              <h3 className="text-xl font-bold text-stone-900 font-cairo">لا توجد نتائج</h3>
              <p className="text-stone-500 mt-2 font-cairo">لم نعثر على أي اشتراكات تطابق معايير البحث الحالية.</p>
            </div>
            <button onClick={() => { setSearchTerm(""); setStatusFilter("all"); }} className="text-blue-600 font-bold text-sm cursor-pointer underline">
              إعادة تعيين الفلاتر
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateSubscription open={isAddOpen} setOpen={setIsAddOpen} userId={userId} userRole={userRole} />
      <EditSubscription subscriptionId={selectedSubscriptionId} open={isEditOpen} setOpen={setIsEditOpen} userId={userId} userRole={userRole} />
      <DeleteSubscription subscriptionId={deleteSubscriptionId} open={isDeleteOpen} setOpen={setIsDeleteOpen} userId={userId} userRole={userRole} />
    </div>
  );
}

export default Subscription;