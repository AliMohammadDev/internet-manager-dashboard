import React from 'react'
import { Globe, Plus, Wifi, Zap, LayoutGrid } from "lucide-react"

function Plan() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">إدارة الباقات</h1>
          <p className="text-stone-500 mt-1">يمكنك هنا تعريف باقات الإنترنت، تحديد السرعات والأسعار.</p>
        </div>
        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-stone-800 transition-colors cursor-pointer">
          <Plus size={20} />
          <span>إضافة باقة جديدة</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
            <Wifi size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500">إجمالي الباقات</p>
            <p className="text-2xl font-bold">8</p>
          </div>
        </div>

        <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500">الباقات الأكثر مبيعاً</p>
            <p className="text-2xl font-bold">باقة 10MB</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
          <LayoutGrid size={32} />
        </div>
        <div>
          <h3 className="text-lg font-medium text-stone-900">لا توجد باقات معرفة حالياً</h3>
          <p className="text-stone-500 text-lg">قم بإضافة باقاتك الأولى لتظهر في القائمة هنا.</p>
        </div>
        <button className="text-stone-600 underline hover:text-black transition-colors cursor-pointer">
          مشاهدة دليل إعداد الباقات
        </button>
      </div>
    </div>
  )
}

export default Plan