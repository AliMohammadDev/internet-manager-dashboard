import React, { useState } from "react";
import {
  Search, Filter, MoreVerticalIcon, Edit, Trash2,
  Loader2, Users, MessageSquare, Phone, User as UserIcon, Network
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
import { useGetCustomers } from "@/api/customer";
import { useGetNetworks } from "@/api/network";
import CreateCustomer from "./CreateCustomer";
import EditCustomer from "./EditCustomer";
import DeleteCustomer from "./DeleteCustomer";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

function Customers() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
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

  const { data: response, isLoading: isLoadingCustomers } = useGetCustomers(page, 10, userId, userRole);
  const { data: networksData } = useGetNetworks(1, 100, userId, userRole);


  const customers = response?.items || [];
  const networks = networksData?.items || [];
  const meta = response?.meta || { total_pages: 0, current_page: 1, total: 0 };


  const filteredCustomers = customers.filter((customer) => {
    const name = String(customer.name || "").toLowerCase();
    const phone = String(customer.phone || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesSearch = name.includes(search) || phone.includes(search);

    const matchesStatus = statusFilter === "all" ? true :
      statusFilter === "active" ? customer.active === true : customer.active === false;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-cairo" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">قائمة الزبائن</h1>
          <p className="text-stone-500 mt-1">إدارة بيانات المشتركين وتفاصيل التواصل الخاصة بهم.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white border border-stone-200 rounded-[24px] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-bold tracking-wider">إجمالي الزبائن في النظام</p>
            <p className="text-2xl font-black text-stone-900">{meta.total}</p>
          </div>
        </div>
        <div className="p-5 bg-white border border-stone-200 rounded-[24px] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <UserIcon size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-bold tracking-wider">النتائج المفلترة</p>
            <p className="text-2xl font-black text-green-600">{filteredCustomers.length}</p>
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
            placeholder="ابحث عن زبون بالاسم أو الهاتف..."
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
        {isLoadingCustomers ? (
          <div className="p-20 text-center flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-stone-400" size={32} />
            جاري تحميل الزبائن...
          </div>
        ) : filteredCustomers.length > 0 ? (

          <>
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader className="bg-stone-50/50">
                  <TableRow>
                    <TableHead className="text-center font-bold text-stone-800 p-4 w-12">#</TableHead>
                    <TableHead className="text-right font-bold p-5">معلومات الزبون</TableHead>
                    <TableHead className="text-right font-bold p-5">رقم التواصل</TableHead>
                    <TableHead className="text-right font-bold p-5">الشبكة والارتباط</TableHead>
                    <TableHead className="text-right font-bold p-5">تاريخ الإضافة</TableHead>
                    <TableHead className="text-right font-bold p-5">الحالة</TableHead>
                    <TableHead className="text-left font-bold p-5">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredCustomers.map((customer, index) => {
                    const networkName = networks.find(n => String(n.id) === String(customer.network_id))?.name || "غير محدد";

                    return (
                      <TableRow key={customer.id} className="hover:bg-stone-50/40 border-b border-stone-100 transition-colors group">
                        <TableCell className="p-4 text-center font-medium text-stone-900 w-10">
                          {index + 1}
                        </TableCell>


                        <TableCell className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 group-hover:bg-black group-hover:text-white transition-all">
                              <UserIcon size={18} />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-stone-900">{customer.name}</span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="p-5 text-right font-medium">
                          <div className="flex items-center gap-2 text-stone-600 bg-stone-50 w-fit px-3 py-1 rounded-lg border border-stone-100">
                            <Phone size={14} className="text-stone-400" />
                            <span dir="ltr" className="text-sm">{customer.phone}</span>
                          </div>
                        </TableCell>

                        <TableCell className="p-5 text-right">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-stone-800 font-bold text-sm">
                              <Network size={14} className="text-indigo-500" />
                              {networkName}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="p-5 text-right">
                          <span className="text-xs text-stone-900">
                            {new Date(customer.created_at).toLocaleDateString('en-UK', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </TableCell>

                        <TableCell className="p-5 text-right">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black ${customer.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${customer.active ? "bg-green-500" : "bg-red-500"}`} />
                            {customer.active ? "نشط" : "متوقف"}
                          </span>
                        </TableCell>

                        <TableCell className="p-5 text-left">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="p-2 hover:bg-stone-100 rounded-xl outline-none transition-colors">
                              <MoreVerticalIcon size={18} className="text-stone-400" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48 font-cairo text-right rounded-2xl p-2 shadow-xl border-stone-100">
                              <DropdownMenuItem
                                onClick={() => { setSelectedCustomerId(customer.id); setIsEditOpen(true); }}
                                className="flex items-center justify-end gap-2 cursor-pointer"
                              >
                                <span>تعديل البيانات</span>
                                <Edit size={16} className="text-blue-500" />
                              </DropdownMenuItem>
                              <div className="h-px bg-stone-100 my-1" />
                              <DropdownMenuItem
                                onClick={() => { setSelectedCustomerId(customer.id); setSelectedCustomerName(customer.name); setIsDeleteOpen(true); }}
                                className="text-red-600 flex items-center justify-end gap-2 cursor-pointer"
                              >
                                <span>حذف الزبون</span>
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
            </div>

            {/* Pagination Logic */}
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
                إجمالي الزبائن: <span className="text-stone-900 font-bold">{meta.total}</span> (صفحة {meta.current_page} من {meta.total_pages})
              </div>
            </div>
          </>

        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-stone-50 rounded-[40px] border-2 border-dashed border-stone-200 mx-4 my-4">
            <Users size={48} className="text-stone-200 mb-2" />
            <p className="text-stone-500 font-bold">لا يوجد زبائن مطابقين للبحث</p>
            <Button variant="link" onClick={() => setIsAddOpen(true)} className="text-stone-600 underline">أضف زبوناً جديداً</Button>
          </div>
        )}
      </div>


      <CreateCustomer
        open={isAddOpen}
        setOpen={setIsAddOpen}
        userId={userId}
        userRole={userRole}
      />

      <EditCustomer
        customerId={selectedCustomerId}
        open={isEditOpen}
        setOpen={setIsEditOpen}
        userId={userId}
        userRole={userRole}
      />

      <DeleteCustomer
        customerId={selectedCustomerId}
        customerName={selectedCustomerName}
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
      />

    </div>
  );
}

export default Customers;