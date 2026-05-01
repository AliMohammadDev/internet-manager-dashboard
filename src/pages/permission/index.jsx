import React, { useState } from "react";
import {
  Search, Filter, MoreVerticalIcon, Edit, Trash2,
  Loader2, ShieldCheck, Key, Lock, Unlock, ShieldAlert, Plus
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
import { Button } from "@/components/ui/button";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious
} from "@/components/ui/pagination";
import CreatePermission from "./CreatePermission";
import { useGetPermissions } from "@/api/permission";
import EditPermission from "./EditPermission";
import DeletePermission from "./DeletePermission";
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { Users } from "lucide-react";

function Permissions() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [selectedPermissionId, setSelectedPermissionId] = useState(null);
  const [selectedPermissionName, setSelectedPermissionName] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
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

  // const { data: stats, isLoading: isLoadingStats } = useGetPermissionStatistics();
  const { data: response, isLoading: isLoadingPermissions } = useGetPermissions(page, 10, userId, userRole);

  const permissions = response?.items || [];
  const meta = response?.meta || { total_pages: 0, current_page: 1, total: 0 };

  const filteredPermissions = permissions.filter((perm) => {
    const name = String(perm.name || "").toLowerCase();
    const desc = String(perm.description || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search) || desc.includes(search);
  });

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">قائمة الصلاحيات</h1>
          <p className="text-stone-500 mt-1">إدارة أذونات النظام والتحكم في وصول المستخدمين .</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-stone-800 transition-all font-bold shadow-sm cursor-pointer"
        >
          <Plus size={20} />
          <span>إنشاء صلاحية نظام</span>
        </button>
      </div>

      {/* stats cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-stone-200 rounded-[24px] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Lock size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-bold tracking-wider">إجمالي الصلاحيات</p>
            {isLoadingStats ? (
              <Loader2 className="animate-spin text-stone-300 size-5 mt-1" />
            ) : (
              <p className="text-2xl font-black text-stone-900">{stats?.totalPermissions || 0}</p>
            )}
          </div>
        </div>

        <div className="p-5 bg-white border border-stone-200 rounded-[24px] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-bold tracking-wider">صلاحيات نشطة</p>
            {isLoadingStats ? (
              <Loader2 className="animate-spin text-stone-300 size-5 mt-1" />
            ) : (
              <p className="text-2xl font-black text-green-600">{stats?.activePermissions || 0}</p>
            )}
          </div>
        </div>

        <div className="p-5 bg-white border border-stone-200 rounded-[24px] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
            <ShieldAlert size={24} className="opacity-60" />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-bold tracking-wider">صلاحيات معطلة</p>
            {isLoadingStats ? (
              <Loader2 className="animate-spin text-stone-300 size-5 mt-1" />
            ) : (
              <p className="text-2xl font-black text-red-600">{stats?.inactivePermissions || 0}</p>
            )}
          </div>
        </div>
      </div> */}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن صلاحية (مثال: CREATE_USER)..."
            className="w-full p-3 pr-10 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-400 bg-white"
          />
        </div>
        <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-2xl px-3 min-w-45 shadow-sm">
          <Filter size={18} className="text-stone-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-0 focus:ring-0 shadow-none w-full">
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
        {isLoadingPermissions ? (
          <div className="p-20 text-center flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-stone-400" size={32} />
            جاري تحميل الصلاحيات...
          </div>
        ) : filteredPermissions.length > 0 ? (
          <>
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader className="bg-stone-50/50">
                  <TableRow>
                    <TableHead className="text-center font-bold text-stone-800 p-4 w-12">#</TableHead>
                    <TableHead className="text-right font-bold p-5">اسم الصلاحية</TableHead>
                    <TableHead className="text-right font-bold p-5">الوصف</TableHead>
                    <TableHead className="text-right font-bold p-5">الحالة</TableHead>
                    <TableHead className="text-left font-bold p-5">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredPermissions.map((perm, index) => (
                    <TableRow key={perm.id} className="hover:bg-stone-50/40 border-b border-stone-100 transition-colors group">
                      <TableCell className="p-4 text-center font-medium text-stone-900 w-10">{index + 1}</TableCell>

                      <TableCell className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 group-hover:bg-black group-hover:text-white transition-all">
                            <Key size={18} />
                          </div>
                          <span className="font-bold text-stone-900 uppercase font-mono tracking-tight">{perm.name}</span>
                        </div>
                      </TableCell>

                      <TableCell className="p-5 text-right text-stone-600 font-medium">
                        {perm.description}
                      </TableCell>

                      <TableCell className="p-5 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black ${perm.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${perm.active ? "bg-green-500" : "bg-red-500"}`} />
                          {perm.active ? "نشطة" : "معطلة"}
                        </span>
                      </TableCell>

                      <TableCell className="p-5 text-left">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-2 hover:bg-stone-100 rounded-xl outline-none">
                            <MoreVerticalIcon size={18} className="text-stone-400" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-48 font-cairo text-right rounded-2xl p-2 shadow-xl border-stone-100">
                            <DropdownMenuItem
                              onClick={() => { setSelectedPermissionId(perm.id); setIsEditOpen(true); }}
                              className="flex items-center justify-end gap-2 cursor-pointer"
                            >
                              <span>تعديل البيانات</span>
                              <Edit size={16} className="text-blue-500" />
                            </DropdownMenuItem>
                            <div className="h-px bg-stone-100 my-1" />
                            <DropdownMenuItem
                              onClick={() => { setSelectedPermissionId(perm.id); setSelectedPermissionName(perm.name); setIsDeleteOpen(true); }}
                              className="text-red-600 flex items-center justify-end gap-2 cursor-pointer"
                            >
                              <span>حذف الصلاحية</span>
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
                      onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
                      className={page === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive className="rounded-lg">{page}</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => { e.preventDefault(); if (page < meta.total_pages) setPage(page + 1); }}
                      className={page === meta.total_pages ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>

        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-stone-50 rounded-[40px] border-2 border-dashed border-stone-200 mx-4 my-4">
            <Key size={48} className="text-stone-200 mb-2" />
            <p className="text-stone-500 font-bold">لا يوجد صلاحيات مطابقين للبحث</p>
            <Button variant="link" onClick={() => setIsAddOpen(true)} className="text-stone-600 underline">أضف صلاحية جديدة</Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreatePermission
        open={isAddOpen}
        setOpen={setIsAddOpen}
        userId={userId}
        userRole={userRole}
      />
      <EditPermission
        customerId={selectedPermissionId}
        open={isEditOpen}
        setOpen={setIsEditOpen}
        userId={userId}
        userRole={userRole}
      />
      <DeletePermission
        customerId={selectedPermissionId}
        customerName={selectedPermissionName}
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
      />

    </div>
  );
}

export default Permissions;