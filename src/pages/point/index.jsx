import React, { useState } from "react";
import {
  Search, Filter, MapPin, MoreVerticalIcon, Edit, Trash2,
  Loader2, Network as NetworkIcon, Plus, Info, Signal
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
import { useGetPoints } from "@/api/point";
import EditPoint from "./EditPoint";
import DeletePoint from "./DeletePoint";
import CreatePoint from "./CreatePoint";
import { ZapOff } from "lucide-react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";


function Points() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isAddOpen, setIsAddOpen] = useState(false);

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

  const { data, isLoading, isError } = useGetPoints(page, 10, userId, userRole);
  const points = data?.items || [];
  const meta = data?.meta || { total_pages: 0, current_page: 1, total: 0 };

  const [selectedPointId, setSelectedPointId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [deletePointId, setDeletePointId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const filteredPoints = points.filter((point) => {
    const pointName = String(point.name || "").toLowerCase();
    const pointLocation = String(point.location || "").toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch = pointName.includes(search) || pointLocation.includes(search);

    const matchesStatus = statusFilter === "all" ? true :
      statusFilter === "active" ? point.active === true :
        point.active === false;

    return matchesSearch && matchesStatus;
  });
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 font-cairo">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">نقاط التوزيع</h1>
          <p className="text-stone-500 mt-1">إدارة نقاط البث والأجهزة المرتبطة بالشبكة.</p>
        </div>
        <CreatePoint
          open={isAddOpen}
          setOpen={setIsAddOpen}
          userId={userId}
          userRole={userRole}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-cairo">
        <div className="p-5 bg-white border border-stone-200 rounded-[24px] shadow-sm flex items-center gap-4 group">
          <div className="w-12 h-12 bg-stone-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-stone-200">
            <Signal size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 uppercase font-bold tracking-wider">إجمالي النقاط</p>
            <p className="text-2xl font-black text-stone-900">{meta.total}</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-stone-200 rounded-[24px] shadow-sm flex items-center gap-4 group hover:border-green-200 transition-colors">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 uppercase font-bold tracking-wider">نقاط متصلة</p>
            <p className="text-2xl font-black text-green-600">
              {points.filter(p => p.active).length}
            </p>
          </div>
        </div>

        <div className="p-5 bg-white border border-stone-200 rounded-[24px] shadow-sm flex items-center gap-4 group hover:border-orange-200 transition-colors">
          <div className="w-12 h-12 bg-orange-50 text-red-600 rounded-2xl flex items-center justify-center">
            <ZapOff size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 uppercase font-bold tracking-wider">نقاط منقطعة</p>
            <p className="text-2xl font-black text-red-600">
              {points.filter(p => !p.active).length}
            </p>
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
            placeholder="ابحث عن نقطة معينة..."
            className="w-full p-3 pr-10 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-400 transition-all bg-white font-cairo"
          />
        </div>

        <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-2xl px-3 min-w-45 shadow-sm">
          <Filter size={18} className="text-stone-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-0 focus:ring-0 font-cairo text-stone-600 shadow-none w-full">
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
          <div className="p-20 text-center text-stone-500 font-bold font-cairo flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-stone-400" size={32} />
            جاري تحميل النقاط...
          </div>
        ) : filteredPoints.length > 0 ? (
          <div className="w-full overflow-x-auto">

            <Table>
              <TableHeader className="bg-stone-50/50">
                <TableRow>
                  <TableHead className="text-right font-bold text-stone-800 p-5">معلومات النقطة</TableHead>
                  <TableHead className="text-right font-bold text-stone-800 p-5">الموقع</TableHead>
                  <TableHead className="text-right font-bold text-stone-800 p-5">الاستهلاك / السعة</TableHead>
                  <TableHead className="text-right font-bold text-stone-800 p-5">تاريخ الإضافة</TableHead>
                  <TableHead className="text-right font-bold text-stone-800 p-5">الحالة</TableHead>
                  <TableHead className="text-left font-bold text-stone-800 p-5">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPoints.map((point) => (
                  <TableRow key={point.id} className="group hover:bg-stone-50/40 transition-colors border-b border-stone-100">

                    <TableCell className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-stone-500 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-stone-100">
                          <NetworkIcon size={18} />
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-stone-900 font-bold"> اسم النقطة: {String(point.name)}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="p-5 text-right font-medium text-stone-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-stone-400" />
                        <span className="text-sm">{point.location}</span>
                      </div>
                    </TableCell>

                    <TableCell className="p-5 text-right">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 justify-start">
                          <span className="text-xs font-bold text-stone-700">{point.count_subscription}</span>
                          <div className="flex-1 h-1.5 w-20 bg-stone-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-stone-800 rounded-full"
                              style={{ width: `${Math.min((point.count_subscription / point.max_subscription) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-stone-400">{point.max_subscription}</span>
                        </div>
                        <span className="text-[10px] text-stone-400">إجمالي المشتركين المتاح</span>
                      </div>
                    </TableCell>

                    <TableCell className="p-5 text-right">
                      <div className="text-xs text-stone-600 font-medium">
                        {new Date(point.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </TableCell>

                    <TableCell className="p-5 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black ${point.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${point.active ? "bg-green-500" : "bg-red-500"}`} />
                        {point.active ? "متصلة" : "منقطعة"}
                      </span>
                    </TableCell>

                    <TableCell className="p-5 text-left">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 hover:bg-stone-100 rounded-xl transition-colors outline-none">
                          <MoreVerticalIcon size={18} className="text-stone-400" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48 font-cairo text-right rounded-2xl p-2 shadow-xl border-stone-100">
                          <DropdownMenuItem
                            onClick={() => { setSelectedPointId(point.id); setIsEditOpen(true); }}
                            className="flex items-center justify-end gap-2 cursor-pointer py-2.5 rounded-xl focus:bg-stone-50"
                          >
                            <span>تعديل البيانات</span>
                            <Edit size={16} className="text-blue-500" />
                          </DropdownMenuItem>
                          <div className="h-px bg-stone-100 my-1" />
                          <DropdownMenuItem
                            onClick={() => { setDeletePointId(point.id); setIsDeleteOpen(true); }}
                            className="flex items-center justify-end gap-2 cursor-pointer text-red-600 py-2.5 rounded-xl focus:bg-red-50 focus:text-red-600"
                          >
                            <span>حذف النقطة</span>
                            <Trash2 size={16} />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* pagination */}
            <div className="p-4 border-t border-stone-100 bg-stone-50/30 flex flex-col items-center gap-3">
              <Pagination>
                <PaginationContent className="flex-row-reverse gap-1">

                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
                      className={`${page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} hover:bg-stone-100`}
                      label="السابق"
                    />
                  </PaginationItem>

                  {[...Array(meta.total_pages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === meta.total_pages ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            isActive={page === pageNum}
                            onClick={(e) => { e.preventDefault(); setPage(pageNum); }}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }

                    if (pageNum === page - 2 || pageNum === page + 2) {
                      return (
                        <PaginationItem key={pageNum}>
                          <span className="px-2 text-stone-400">...</span>
                        </PaginationItem>
                      );
                    }

                    return null;
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => { e.preventDefault(); if (page < meta.total_pages) setPage(page + 1); }}
                      className={`${page === meta.total_pages ? "pointer-events-none opacity-50" : "cursor-pointer"} hover:bg-stone-100`}
                      label="التالي"
                    />
                  </PaginationItem>

                </PaginationContent>
              </Pagination>

              <div className="flex items-center gap-2 text-xs text-stone-400 font-cairo">
                <span>إجمالي المستخدمين: <span className="font-bold text-stone-600">{meta.total}</span></span>
                <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                <span>صفحة {meta.current_page} من {meta.total_pages}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-stone-50 rounded-[40px] border-2 border-dashed border-stone-200">
            <NetworkIcon size={48} className="text-stone-200" />
            <p className="text-stone-500 font-bold">لا توجد نقاط توزيع مضافة حالياً</p>
            <Button variant="link" onClick={() => setIsAddOpen(true)} className="text-stone-600 underline">أضف أول نقطة الآن</Button>
          </div>
        )}
      </div>

      <EditPoint id={selectedPointId} open={isEditOpen} setOpen={setIsEditOpen} />
      <DeletePoint id={deletePointId} open={isDeleteOpen} setOpen={setIsDeleteOpen} />
    </div>
  );
}

export default Points;