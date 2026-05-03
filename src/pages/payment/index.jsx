import React, { useState } from "react";
import {
  Search, Filter, MoreVerticalIcon, Edit, Trash2,
  Loader2, Plus, LayoutGrid, CircleDollarSign, CheckCircle2, XCircle
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import EditPayment from "./EditPayment";
import DeletePayment from "./DeletePayment";
import CreatePayment from "./CreatePayment";
import { useGetPayments } from "@/api/payment";

function Payment() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletePaymentId, setDeletePaymentId] = useState(null);
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
    } catch (error) { console.error(error); }
  }

  const { data: response, isLoading } = useGetPayments(page, 10, userId, userRole);
  const payments = response?.items || [];
  const meta = response?.meta || { total_pages: 0, current_page: 1, total: 0 };

  const stats = {
    total: meta.total || 0,
    active: payments.filter(p => p.active === true).length,
    inactive: payments.filter(p => p.active === false).length
  };

  const filteredPayments = payments.filter((pay) => {
    const matchesSearch = String(pay.subscription_id).includes(searchTerm);
    const matchesStatus = statusFilter === "all" ? true :
      statusFilter === "active" ? pay.active === true : pay.active === false;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">سجل المدفوعات</h1>
          <p className="text-stone-500 mt-1">إدارة وحالة مدفوعات الاشتراكات.</p>
        </div>
        <CreatePayment open={isAddOpen} setOpen={setIsAddOpen} userId={userId} userRole={userRole} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-stone-200 rounded-[24px] shadow-sm flex items-center gap-4 group">
          <div className="w-12 h-12 bg-stone-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-stone-200">
            <LayoutGrid size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-bold tracking-wider">إجمالي السجلات</p>
            <p className="text-2xl font-black text-stone-900">{stats.total}</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-stone-200 rounded-[24px] shadow-sm flex items-center gap-4 group hover:border-green-200 transition-colors">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-bold tracking-wider">مدفوعات مفعلة</p>
            <p className="text-2xl font-black text-green-600">{stats.active}</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-stone-200 rounded-[24px] shadow-sm flex items-center gap-4 group hover:border-red-200 transition-colors">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-bold tracking-wider">مدفوعات ملغاة</p>
            <p className="text-2xl font-black text-red-600">{stats.inactive}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث برقم الاشتراك..."
            className="w-full p-3 pr-10 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-stone-400 bg-white"
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-2xl px-3 min-w-45 shadow-sm">
          <Filter size={18} className="text-stone-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-0 focus:ring-0 text-stone-600 w-full shadow-none">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent dir="rtl" className="font-cairo">
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="active">مفعلة</SelectItem>
              <SelectItem value="inactive">ملغاة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded-[28px] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-stone-400" size={32} />
            جاري تحميل المدفوعات...
          </div>
        ) : filteredPayments.length > 0 ? (
          <div className="w-full overflow-x-auto">
            {/* Table Section المحدث */}
            <Table>
              <TableHeader className="bg-stone-50/50">
                <TableRow>
                  <TableHead className="text-center font-bold text-stone-800 p-4 w-12">#</TableHead>
                  <TableHead className="text-right font-bold text-stone-800 p-5">الزبون</TableHead>
                  <TableHead className="text-right font-bold text-stone-800 p-5">الباقة</TableHead>
                  <TableHead className="text-right font-bold text-stone-800 p-5">نقطة البيع</TableHead>
                  <TableHead className="text-right font-bold text-stone-800 p-5">المبلغ</TableHead>
                  <TableHead className="text-right font-bold text-stone-800 p-5">الحالة</TableHead>
                  <TableHead className="text-left font-bold text-stone-800 p-5">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((pay, index) => (
                  <TableRow key={pay.id} className="group hover:bg-stone-50/40 border-b border-stone-100 transition-colors">
                    <TableCell className="p-4 text-center font-medium text-stone-900">
                      {(page - 1) * 10 + index + 1}
                    </TableCell>

                    {/* عرض اسم الزبون */}
                    <TableCell className="p-5 text-right font-bold text-stone-900">
                      {pay.subscription?.customer?.name || "غير محدد"}
                    </TableCell>

                    {/* عرض اسم الباقة وسرعتها */}
                    <TableCell className="p-5 text-right">
                      <div className="flex flex-col">
                        <span className="font-medium text-stone-900">{pay.subscription?.plan?.name}</span>
                        <span className="text-[10px] text-stone-500">{pay.subscription?.plan?.speed} Mbps</span>
                      </div>
                    </TableCell>

                    {/* عرض نقطة البيع */}
                    <TableCell className="p-5 text-right text-stone-600">
                      {pay.subscription?.point?.name || "نقطة عامة"}
                    </TableCell>

                    {/* عرض المبلغ بتنسيق مالي */}
                    <TableCell className="p-5 text-right font-black text-stone-900">
                      {pay.amount} <span className="text-[10px] font-normal text-stone-500 font-cairo">ل.س</span>
                    </TableCell>

                    <TableCell className="p-5 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black ${pay.active ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${pay.active ? "bg-green-500" : "bg-red-500"}`} />
                        {pay.active ? "مقبول" : "ملغى"}
                      </span>
                    </TableCell>

                    <TableCell className="p-5 text-left">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 hover:bg-stone-100 rounded-xl outline-none cursor-pointer transition-colors">
                          <MoreVerticalIcon size={18} className="text-stone-400" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48 font-cairo text-right rounded-2xl p-2 shadow-xl border-stone-100">
                          <DropdownMenuItem onClick={() => { setSelectedPaymentId(pay.id); setIsEditOpen(true); }} className="flex justify-end gap-2 cursor-pointer py-2.5 rounded-xl hover:bg-stone-50">
                            <span>تعديل الحالة</span>
                            <Edit size={16} className="text-blue-500" />
                          </DropdownMenuItem>
                          <div className="h-px bg-stone-100 my-1" />
                          <DropdownMenuItem onClick={() => { setDeletePaymentId(pay.id); setIsDeleteOpen(true); }} className="flex justify-end gap-2 cursor-pointer text-red-600 py-2.5 rounded-xl hover:bg-red-50">
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

            {/* Pagination Section */}
            <div className="p-4 border-t border-stone-100 bg-stone-50/30 flex flex-col items-center gap-3">
              <Pagination>
                <PaginationContent className="flex-row-reverse gap-1">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => page > 1 && setPage(page - 1)}
                      className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {[...Array(meta.total_pages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={page === i + 1}
                        onClick={() => setPage(i + 1)}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => page < meta.total_pages && setPage(page + 1)}
                      className={page === meta.total_pages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <div className="text-xs text-stone-400">
                إجمالي السجلات: {meta.total} | صفحة {meta.current_page} من {meta.total_pages}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <CircleDollarSign size={48} className="text-stone-200 mb-4" />
            <p className="text-stone-500 font-bold">لا توجد سجلات مدفوعات</p>
            <Button variant="link" onClick={() => setIsAddOpen(true)} className="text-stone-900 underline">إضافة دفعة جديدة</Button>
          </div>
        )}
      </div>

      <EditPayment paymentId={selectedPaymentId} open={isEditOpen} setOpen={setIsEditOpen} userId={userId} userRole={userRole} />
      <DeletePayment paymentId={deletePaymentId} open={isDeleteOpen} setOpen={setIsDeleteOpen} userId={userId} userRole={userRole} />
    </div>
  );
}

export default Payment;