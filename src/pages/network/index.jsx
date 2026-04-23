import React, { useState } from 'react'
import { Plus, Network as NetworkIcon, MapPin, MoreHorizontal, Edit, Trash2, Loader2, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useGetNetworks } from "@/api/network"
import CreateNetwork from './CreateNetwork'
import EditNetwork from './EditNetwork'
import DeleteNetwork from './DeleteNetwork'

function Network() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [targetName, setTargetName] = useState("");

  const userId = 1;

  const { data, isLoading, isError } = useGetNetworks(1, 10, userId);

  return (
    <div className="p-6 font-cairo" dir="rtl">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-stone-900 flex items-center gap-3">
            <NetworkIcon size={32} className="text-stone-700" />
            إدارة الشبكات
          </h1>
          <p className="text-stone-500 mt-1">متابعة وتوسيع نطاق تغطية إنترنت  </p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-stone-900 hover:bg-stone-800 text-white px-8 h-12 rounded-2xl font-bold gap-2 shadow-lg transition-all active:scale-95 shadow-stone-200"
        >
          <Plus size={20} /> إضافة شبكة جديدة
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-80 gap-4">
          <div className="relative">
            <Loader2 className="animate-spin text-stone-800" size={48} />
            <NetworkIcon size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-stone-400" />
          </div>
          <p className="text-stone-500 font-bold animate-pulse">جاري جلب بيانات الشبكات...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center h-80 text-red-500 bg-red-50 rounded-[32px] border border-red-100">
          <WifiOff size={48} className="mb-4" />
          <p className="font-bold text-lg text-red-900">حدث خطأ أثناء الاتصال بالسيرفر</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {data?.items?.length > 0 ? (
            data.items.map((net) => (
              <Card key={net.id} className="border-none shadow-md hover:shadow-2xl transition-all duration-300 rounded-[32px] overflow-hidden group border border-transparent hover:border-stone-200 bg-white">
                <CardHeader className="bg-stone-50/50 pb-4 relative">
                  <div className="flex justify-between items-start">
                    <Badge className={`${net.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} border-none px-4 py-1 rounded-full text-xs font-bold`}>
                      {net.active ? "نشطة" : "متوقفة"}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-white rounded-full transition-colors">
                          <MoreHorizontal size={20} className="text-stone-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="font-cairo text-right min-w-40 rounded-2xl p-2 shadow-xl border-stone-100">
                        <DropdownMenuItem
                          onClick={() => setEditId(net.id)}
                          className="flex justify-end gap-3 cursor-pointer py-3 rounded-xl focus:bg-stone-50 transition-colors"
                        >
                          <span className="font-bold text-stone-700">تعديل البيانات</span>
                          <Edit size={18} className="text-blue-500" />
                        </DropdownMenuItem>
                        <div className="h-px bg-stone-100 my-1" />
                        <DropdownMenuItem
                          onClick={() => {
                            setDeleteId(net.id);
                            setTargetName(net.name);
                          }}
                          className="flex justify-end gap-3 text-red-600 cursor-pointer py-3 rounded-xl focus:bg-red-50 transition-colors"
                        >
                          <span className="font-bold">حذف الشبكة</span>
                          <Trash2 size={18} />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardTitle className="text-2xl font-black mt-6 text-stone-800 tracking-tight group-hover:text-stone-900 transition-colors">
                    {net.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 pb-8 space-y-4">
                  <div className="flex items-center gap-3 text-stone-500 bg-stone-50 p-3 rounded-2xl border border-stone-100/50">
                    <MapPin size={18} className="text-stone-400" />
                    <span className="text-sm font-bold tracking-wide">{net.location}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-stone-50 rounded-[40px] border-2 border-dashed border-stone-200">
              <NetworkIcon size={60} className="text-stone-200 mb-4" />
              <p className="text-stone-400 font-bold text-xl">لا يوجد شبكات مضافة بعد</p>
              <Button variant="link" onClick={() => setIsAddOpen(true)} className="text-stone-600 underline">أضف أول شبكة الآن</Button>
            </div>
          )}
        </div>
      )}


      <CreateNetwork
        open={isAddOpen}
        setOpen={setIsAddOpen}
        userId={userId}
      />

      <EditNetwork
        networkId={editId}
        open={!!editId}
        setOpen={(val) => !val && setEditId(null)}
      />

      <DeleteNetwork
        networkId={deleteId}
        networkName={targetName}
        open={!!deleteId}
        setOpen={(val) => !val && setDeleteId(null)}
      />
    </div>
  )
}

export default Network;