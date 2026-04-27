import React from 'react'
import { Users, UserPlus, ShieldCheck, UserX, Search, Filter } from "lucide-react"
import { useGetUsers } from '@/api/user';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { Phone } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVerticalIcon } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CreateUser from './CreateUser';
import EditUser from './EditUser';
import DeleteUser from './DeleteUser';

function User() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: response, isLoading, isError } = useGetUsers(page, 5);

  const users = response?.data?.items || [];
  const meta = response?.data?.meta || { total_pages: 0, current_page: 1, total: 0 };

  const stats = {
    total: response?.totalUsers || 0,
    active: response?.activeUsers || 0,
    inactive: response?.inactiveUsers || 0
  };


  // update user
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const openEditModal = (id) => {
    setSelectedUserId(id);
    setIsEditOpen(true);
  };


  // delete user
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const openDeleteModal = (id) => {
    setDeleteUserId(id);
    setIsDeleteOpen(true);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" ? true :
        statusFilter === "active" ? user.active === true :
          user.active === false;

    return matchesSearch && matchesStatus;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900"> إدارة المشتركين في النظام</h1>
          <p className="text-stone-500 mt-1">عرض بيانات مستخدمي الشبكة وإدارة حساباتهم وتفعيلها.</p>
        </div>
        {/* create user button */}
        <div className="flex gap-2">
          <CreateUser />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-cairo">
        <div className="p-5 bg-white border border-stone-200 rounded-[24px] shadow-sm flex items-center gap-4 transition-all hover:border-blue-200">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-bold">إجمالي المشتركين</p>
            <p className="text-2xl font-black text-stone-900">{stats.total.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-stone-200 rounded-[24px] shadow-sm flex items-center gap-4 transition-all hover:border-green-200">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-bold">اشتراكات نشطة</p>
            <p className="text-2xl font-black text-green-600">{stats.active.toLocaleString()}</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-stone-200 rounded-[24px] shadow-sm flex items-center gap-4 transition-all hover:border-orange-200">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
            <UserX size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-bold">حسابات معطلة</p>
            <p className="text-2xl font-black text-orange-600">{stats.inactive.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        {/* search */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="ابحث في هذه الصفحة بالاسم ..."
            className="w-full p-3 pr-10 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-400 transition-all bg-white font-cairo"
          />
        </div>

        {/* filter */}
        <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl px-3 min-w-50 shadow-sm">
          <Filter size={18} className="text-stone-400" />

          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="border-0 focus:ring-0 font-cairo text-stone-600 shadow-none w-full bg-transparent">
              <SelectValue placeholder="اختر الحالة" />
            </SelectTrigger>

            <SelectContent className="font-cairo text-right" dir="rtl">
              <SelectItem value="all" className="cursor-pointer">
                جميع الحالات
              </SelectItem>
              <SelectItem value="active" className="cursor-point">
                نشط فقط
              </SelectItem>
              <SelectItem value="inactive" className="cursor-pointe">
                غير نشط
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>


      <div className="bg-white border border-stone-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center text-stone-500 font-medium font-cairo">جاري تحميل البيانات...</div>
        ) : isError ? (
          <div className="p-20 text-center text-red-500 font-medium font-cairo">حدث خطأ أثناء جلب البيانات.</div>
        ) : users?.length > 0 ? (
          <>
            {/* table */}
            <div className="w-full overflow-x-auto">

              <Table>
                <TableHeader className="bg-stone-50/50">
                  <TableRow>
                    <TableHead className="text-right font-bold text-stone-800 p-4">المشترك</TableHead>
                    <TableHead className="text-right font-bold text-stone-800 p-4">التواصل</TableHead>
                    <TableHead className="text-right font-bold text-stone-800 p-4">الدور</TableHead>
                    <TableHead className="text-right font-bold text-stone-800 p-4">العنوان</TableHead>
                    <TableHead className="text-right font-bold text-stone-800 p-4">الحالة</TableHead>
                    <TableHead className="text-left font-bold text-stone-800 p-4">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                {/* data */}

                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-stone-50/40 transition-colors border-b border-stone-100">
                      <TableCell className="p-4">
                        <div className="flex flex-col text-right">
                          <span className="text-stone-900 font-bold">{user.name}</span>
                          <span className="text-xs text-stone-400">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="p-4 text-right">
                        <div className="flex flex-col text-sm text-stone-600 gap-1">
                          <div className="flex items-center gap-1.5 justify-start">
                            <Phone size={14} className="text-stone-400" />
                            <span dir="ltr">{user.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="p-4 text-right">
                        <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold border ${user.role === 'admin'
                          ? "bg-purple-50 text-purple-700 border-purple-100"
                          : "bg-blue-50 text-blue-700 border-blue-100"
                          }`}>
                          {user.role === 'admin' ? "مدير نظام" : "مستخدم"}
                        </span>
                      </TableCell>
                      <TableCell className="p-4 text-right">
                        <div className="flex items-center gap-1.5 text-sm text-stone-600 justify-start">
                          <MapPin size={14} className="text-stone-400" /> {user.address}
                        </div>
                      </TableCell>
                      <TableCell className="p-4 text-right">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${user.active ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-600"}`}>
                          {user.active ? "نشط" : "غير نشط"}
                        </span>
                      </TableCell>
                      <TableCell className="p-4 text-left">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-2 hover:bg-stone-100 rounded-lg outline-none transition-colors">
                            <MoreVerticalIcon size={18} className="text-stone-500" />
                          </DropdownMenuTrigger>
                          {/* actions */}
                          <DropdownMenuContent align="start" className="w-48 font-cairo text-right">
                            <DropdownMenuItem
                              onClick={() => openEditModal(user.id)}
                              className="flex items-center justify-end gap-2 cursor-pointer py-2">
                              <span>تعديل البيانات</span>
                              <Edit size={16} className='text-blue-500' />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="flex items-center justify-end gap-2 cursor-pointer text-red-600 focus:text-red-600 py-2"
                              onClick={() => openDeleteModal(user.id)}
                            >
                              <span>حذف الحساب</span>
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
          </>
        ) : (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
              <Users size={32} />
            </div>
            <div className="font-cairo">
              <h3 className="text-lg font-medium text-stone-900">قائمة المستخدمين فارغة</h3>
              <p className="text-stone-500">لم يتم إضافة مستخدمين بعد. ابدأ بإنشاء أول حساب مشترك.</p>
            </div>
          </div>
        )}
      </div>

      <EditUser
        userId={selectedUserId}
        open={isEditOpen}
        setOpen={setIsEditOpen}
      />

      <DeleteUser
        userId={deleteUserId}
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
      />


    </div>
  )
}

export default User