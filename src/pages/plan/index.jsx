import React, { useState } from "react";
import {
  Search, Filter, MoreVerticalIcon, Edit, Trash2,
  Loader2, Plus, Info, LayoutGrid, Zap, CircleDollarSign, Wifi
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
import { useGetPlans } from "@/api/plan";
import { useGetNetworks } from "@/api/network";
import CreatePlan from "./CreatePlan";
import { Button } from "@/components/ui/button";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import EditPlan from "./EditPlan";
import DeletePlan from "./DeletePln";

function Plan() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletePlanId, setDeletePlanId] = useState(null);
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



  const { data: networksData } = useGetNetworks(1, 100, userId, userRole);
  const networks = networksData?.items || [];

  const { data: response, isLoading, isError } = useGetPlans(page, 10, userId, userRole);

  const plans = response?.items || [];
  const meta = response?.meta || { total_pages: 0, current_page: 1, total: 0 };

  const stats = {
    total: meta.total || 0,
    active: plans.filter(p => p.active === true).length,
    inactive: plans.filter(p => p.active === false).length
  };

  const filteredPlans = plans.filter((plan) => {
    const planName = String(plan.name || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesSearch = planName.includes(search);

    const matchesStatus = statusFilter === "all" ? true :
      statusFilter === "active" ? plan.active === true :
        plan.active === false;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">إدارة الباقات</h1>
          <p className="text-stone-500 mt-1">إدارة خطط الإنترنت، السرعات، والأسعار المتاحة.</p>
        </div>
        <CreatePlan
          open={isAddOpen}
          setOpen={setIsAddOpen}
          userId={userId}
          userRole={userRole}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-stone-200 rounded-[24px] shadow-sm flex items-center gap-4 group">
          <div className="w-12 h-12 bg-stone-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-stone-200">
            <LayoutGrid size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-bold tracking-wider">إجمالي الباقات</p>
            <p className="text-2xl font-black text-stone-900">{stats.total}</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-stone-200 rounded-[24px] shadow-sm flex items-center gap-4 group hover:border-green-200 transition-colors">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <Wifi size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-bold tracking-wider">باقات نشطة</p>
            <p className="text-2xl font-black text-green-600">{stats.active}</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-stone-200 rounded-[24px] shadow-sm flex items-center gap-4 group hover:border-orange-200 transition-colors">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
            <Info size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-bold tracking-wider">باقات معطلة</p>
            <p className="text-2xl font-black text-orange-600">{stats.inactive}</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن باقة معينة..."
            className="w-full p-3 pr-10 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-400 transition-all bg-white"
          />
        </div>

        <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-2xl px-3 min-w-45 shadow-sm">
          <Filter size={18} className="text-stone-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-0 focus:ring-0 text-stone-600 shadow-none w-full">
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent dir="rtl" className="font-cairo">
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="active">نشطة</SelectItem>
              <SelectItem value="inactive">غير نشطة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-stone-200 rounded-[28px] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center text-stone-500 font-bold flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-stone-400" size={32} />
            جاري تحميل الباقات...
          </div>
        ) : filteredPlans.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader className="bg-stone-50/50">
                <TableRow>
                  <TableHead className="text-center font-bold text-stone-800 p-4 w-12">#</TableHead>
                  <TableHead className="text-right font-bold text-stone-800 p-5">اسم الباقة</TableHead>
                  <TableHead className="text-right font-bold text-stone-800 p-5">السرعة (Mbps)</TableHead>
                  <TableHead className="text-right font-bold text-stone-800 p-5">السعر</TableHead>
                  <TableHead className="text-right font-bold text-stone-800 p-5">الشبكة</TableHead>
                  <TableHead className="text-right font-bold text-stone-800 p-5">الحالة</TableHead>
                  <TableHead className="text-left font-bold text-stone-800 p-5">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan, index) => {
                  const networkName = networks.find(
                    (net) => String(net.id) === String(plan.network_id)
                  )?.name || "غير محدد";

                  return (
                    <TableRow key={plan.id} className="group hover:bg-stone-50/40 transition-colors border-b border-stone-100">

                      <TableCell className="p-4 text-center font-medium text-stone-900 w-10">
                        {index + 1}
                      </TableCell>

                      <TableCell className="p-5 text-right font-bold text-stone-900">
                        {plan.name}
                      </TableCell>

                      <TableCell className="p-5 text-right font-medium text-stone-600">
                        <div className="flex items-center gap-2">
                          <Zap size={14} className="text-amber-600" />
                          <span className="text-stone-900">{plan.speed} Mbps</span>
                        </div>
                      </TableCell>

                      <TableCell className="p-5 text-right font-black text-stone-900">
                        <div className="flex items-center gap-1">
                          <CircleDollarSign size={14} className="text-green-600" />
                          <span>${plan.price}</span>
                        </div>
                      </TableCell>

                      <TableCell className="p-5 text-right font-bold text-stone-900">
                        <span className="bg-stone-100 px-3 py-1 rounded-lg text-sm">{networkName}</span>
                      </TableCell>

                      <TableCell className="p-5 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black ${plan.active ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${plan.active ? "bg-green-500" : "bg-stone-400"}`} />
                          {plan.active ? "نشطة" : "معطلة"}
                        </span>
                      </TableCell>

                      <TableCell className="p-5 text-left">

                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-2 hover:bg-stone-100 rounded-xl transition-colors outline-none cursor-pointer">
                            <MoreVerticalIcon size={18} className="text-stone-400" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-48 font-cairo text-right rounded-2xl p-2 shadow-xl border-stone-100">
                            <DropdownMenuItem
                              onClick={() => { setSelectedPlanId(plan.id); setIsEditOpen(true); }}
                              className="flex items-center justify-end gap-2 cursor-pointer py-2.5 rounded-xl focus:bg-stone-50"
                            >
                              <span>تعديل الباقة</span>
                              <Edit size={16} className="text-blue-500" />
                            </DropdownMenuItem>
                            <div className="h-px bg-stone-100 my-1" />
                            <DropdownMenuItem
                              onClick={() => { setDeletePlanId(plan.id); setIsDeleteOpen(true); }}
                              className="flex items-center justify-end gap-2 cursor-pointer text-red-600 py-2.5 rounded-xl focus:bg-red-50"
                            >
                              <span>حذف الباقة</span>
                              <Trash2 size={16} />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination */}
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
                      <PaginationLink isActive={page === i + 1} onClick={() => setPage(i + 1)} className="cursor-pointer">
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
                إجمالي الباقات: {meta.total} | صفحة {meta.current_page} من {meta.total_pages}
              </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <LayoutGrid size={48} className="text-stone-200 mb-4" />
            <p className="text-stone-500 font-bold">لا توجد باقات تطابق بحثك</p>
            <Button variant="link" onClick={() => setIsAddOpen(true)} className="text-stone-900 font-bold underline">إضافة باقة جديدة</Button>
          </div>
        )}
      </div>


      <EditPlan
        planId={selectedPlanId}
        open={isEditOpen}
        setOpen={setIsEditOpen}
        userId={userId}
        userRole={userRole} />

      <DeletePlan
        planId={deletePlanId}
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
        userId={userId}
        userRole={userRole} />
    </div>
  );
}

export default Plan;  