import React, { useState } from "react";
import {
  Search, Filter, MoreVerticalIcon, Edit, Trash2,
  Loader2, Users, Phone, Mail, Briefcase, ShieldCheck, UserPlus
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
import Cookie from "cookie-universal";
import { jwtDecode } from "jwt-decode";
import { useGetEmployees, useGetEmployeeStatistics } from "@/api/employee";
import CreateEmployee from "./CreateEmployee";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import EditEmployee from "./EditEmployee";
import DeleteEmployee from "./DeleteEmployee";

function Employees() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: stats, isLoading: isLoadingStats } = useGetEmployeeStatistics();


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

  const { data: response, isLoading: isLoadingEmployees } = useGetEmployees(page, 10, userId, userRole);

  const employees = response?.items || [];
  const meta = response?.meta || { total_pages: 0, current_page: 1, total: 0 };

  const filteredEmployees = employees.filter((emp) => {
    const name = String(emp.full_name || "").toLowerCase();
    const email = String(emp.email || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesSearch = name.includes(search) || email.includes(search);

    const matchesStatus = statusFilter === "all" ? true :
      statusFilter === "active" ? emp.active === true : emp.active === false;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">إدارة الموظفين</h1>
          <p className="text-stone-500 mt-1">إدارة صلاحيات الموظفين، بيانات الدخول، وحالات الحسابات.</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-stone-900 cursor-pointer active:scale-95 text-white px-6 py-3 rounded-2xl hover:bg-stone-800 transition-all font-bold font-cairo shadow-lg shadow-stone-100"
        >
          <UserPlus size={20} />
          <span>إضافة موظف جديد</span>
        </button>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* Card: Total Employees */}
        <div className="p-6 bg-white border border-stone-200 rounded-[32px] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <Users size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-500 mb-1">إجمالي الموظفين</p>
              {isLoadingStats ? (
                <Loader2 className="animate-spin text-stone-300 size-6" />
              ) : (
                <h3 className="text-3xl font-black text-stone-900 leading-none">
                  {stats?.totalEmployees || 0}
                </h3>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-stone-200 rounded-[32px] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-500 mb-1">الموظفون النشطون</p>
              {isLoadingStats ? (
                <Loader2 className="animate-spin text-stone-300 size-6" />
              ) : (
                <h3 className="text-3xl font-black text-green-600 leading-none">
                  {stats?.activeEmployees || 0}
                </h3>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-stone-200 rounded-[32px] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center">
              <Users size={28} className="opacity-60" />
            </div>
            <div>
              <p className="text-sm font-bold text-stone-500 mb-1">غير نشط</p>
              {isLoadingStats ? (
                <Loader2 className="animate-spin text-stone-300 size-6" />
              ) : (
                <h3 className="text-3xl font-black text-red-600 leading-none">
                  {stats?.inactiveEmployees || 0}
                </h3>
              )}
            </div>
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
            placeholder="ابحث عن موظف بالاسم أو البريد..."
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
              <SelectItem value="active">نشط</SelectItem>
              <SelectItem value="inactive">غير نشط</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-stone-200 rounded-[28px] shadow-sm overflow-hidden">
        {isLoadingEmployees ? (
          <div className="p-20 text-center flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-stone-400" size={32} />
            جاري تحميل بيانات الموظفين...
          </div>
        ) : filteredEmployees.length > 0 ? (
          <>
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader className="bg-stone-50/50">
                  <TableRow>
                    <TableHead className="text-center font-bold text-stone-800 p-4 w-12">#</TableHead>
                    <TableHead className="text-right font-bold p-5">الموظف</TableHead>
                    <TableHead className="text-right font-bold p-5">الايميل</TableHead>
                    <TableHead className="text-right font-bold p-5">الحالة</TableHead>
                    <TableHead className="text-left font-bold p-5">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredEmployees.map((emp, index) => (
                    <TableRow key={emp.id} className="hover:bg-stone-50/40 border-b border-stone-100 transition-colors group">
                      <TableCell className="p-4 text-center font-medium text-stone-900 w-10">
                        {index + 1}
                      </TableCell>

                      <TableCell className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 group-hover:bg-black group-hover:text-white transition-all">
                            <Users size={18} />
                          </div>
                          <div className="flex flex-col text-right">
                            <span className="font-bold text-stone-900">{emp.full_name}</span>

                          </div>
                        </div>
                      </TableCell>


                      <TableCell className="p-5 text-right font-medium">
                        <div className="flex items-center gap-2 text-stone-900 bg-stone-50 w-fit px-3 py-1.5 rounded-lg border border-stone-100 group-hover:bg-white transition-colors">
                          <Mail size={14} className="text-stone-900" />
                          <span className="text-sm font-semibold tracking-wide lowercase">{emp.email}</span>
                        </div>
                      </TableCell>


                      <TableCell className="p-5 text-right">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black ${emp.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${emp.active ? "bg-green-500" : "bg-red-500"}`} />
                          {emp.active ? "نشط" : "غير نشط"}
                        </span>
                      </TableCell>

                      <TableCell className="p-5 text-left">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-2 hover:bg-stone-100 rounded-xl outline-none transition-colors">
                            <MoreVerticalIcon size={18} className="text-stone-400" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-48 font-cairo text-right rounded-2xl p-2 shadow-xl border-stone-100">
                            <DropdownMenuItem
                              onClick={() => { setSelectedEmployeeId(emp.id); setIsEditOpen(true); }}
                              className="flex items-center justify-end gap-2 cursor-pointer"
                            >
                              <span>تعديل البيانات</span>
                              <Edit size={16} className="text-blue-500" />
                            </DropdownMenuItem>
                            <div className="h-px bg-stone-100 my-1" />
                            <DropdownMenuItem
                              onClick={() => { setSelectedEmployeeId(emp.id); setSelectedEmployeeName(emp.name); setIsDeleteOpen(true); }}
                              className="text-red-600 flex items-center justify-end gap-2 cursor-pointer"
                            >
                              <span>حذف الموظف</span>
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
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-stone-50 rounded-[40px] border-2 border-dashed border-stone-200 mx-4 my-4">
            <Users size={48} className="text-stone-200 mb-2" />
            <p className="text-stone-500 font-bold">لا يوجد موظفين حالياً</p>
            <Button variant="link" onClick={() => setIsAddOpen(true)} className="text-stone-600 underline">أضف موظفاً جديداً</Button>
          </div>
        )}
      </div>

      <CreateEmployee
        open={isAddOpen}
        setOpen={setIsAddOpen}
        userId={userId}
        userRole={userRole}
      />

      <EditEmployee
        employeeId={selectedEmployeeId}
        open={isEditOpen}
        setOpen={setIsEditOpen}
        userId={userId}
        userRole={userRole}
      />

      <DeleteEmployee
        employeeId={selectedEmployeeId}
        employeeName={setSelectedEmployeeName}
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
      />
    </div>
  );
}

export default Employees;