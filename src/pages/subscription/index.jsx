import React from 'react'
import { Ticket, Plus, CalendarClock, CreditCard, Activity, Search, ArrowUpRight } from "lucide-react"

function Subscription() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">اشتراكات المستخدمين</h1>
          <p className="text-stone-500 mt-1">إدارة عمليات التجديد، مراقبة الحسابات النشطة، وتاريخ انتهاء الصلاحية.</p>
        </div>
        <button className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-md hover:bg-stone-800 transition-colors cursor-pointer font-bold shadow-sm">
          <Plus size={20} />
          <span>تجديد اشتراك يدوي</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-medium">الاشتراكات الفعالة</p>
            <p className="text-2xl font-bold">842</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
            <CalendarClock size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-medium">تنتهي اليوم</p>
            <p className="text-2xl font-bold">12</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-medium">تحصيلات الشهر</p>
            <p className="text-2xl font-bold">4.2M ل.س</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input
            type="text"
            placeholder="ابحث برقم المشترك أو اسم المستخدم..."
            className="w-full p-3 pr-10 border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-stone-100"
          />
        </div>
        <button className="px-4 py-2 bg-stone-100 text-stone-600 rounded-xl hover:bg-stone-200 font-bold transition-all cursor-pointer border border-stone-200">
          تصدير التقرير
        </button>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[350px]">
        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-300">
          <Ticket size={40} />
        </div>
        <div className="max-w-sm">
          <h3 className="text-xl font-bold text-stone-900">سجل الاشتراكات</h3>
          <p className="text-stone-500 mt-2 text-lg">
            لا توجد عمليات تجديد حالية. جميع اشتراكات المستخدمين ستظهر هنا مرتبة حسب تاريخ التجديد.
          </p>
        </div>
        <button className="text-black font-bold flex items-center gap-1 hover:gap-2 transition-all cursor-pointer">
          إضافة أول اشتراك الآن <ArrowUpRight size={18} />
        </button>
      </div>
    </div>
  )
}

export default Subscription