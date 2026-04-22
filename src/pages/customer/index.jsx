import React from 'react'
import { Users, UserPlus, Phone, MapPin, Search, MessageSquare } from "lucide-react"

function Customer() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">قائمة الزبائن</h1>
          <p className="text-stone-500 mt-1">بيانات التواصل مع العملاء والزبائن الدائمين للشبكة.</p>
        </div>
        <button className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-md hover:bg-stone-800 transition-colors cursor-pointer font-bold">
          <UserPlus size={20} />
          <span>إضافة زبون</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-medium">إجمالي الزبائن</p>
            <p className="text-2xl font-bold">3,420</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-stone-100 text-stone-600 rounded-full flex items-center justify-center">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500 font-medium">طلبات جديدة</p>
            <p className="text-2xl font-bold">15</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
        <input
          type="text"
          placeholder="ابحث عن زبون بالاسم، العنوان، أو رقم الهاتف..."
          className="w-full p-4 pr-12 border border-stone-200 rounded-2xl bg-white focus:ring-2 focus:ring-stone-100 outline-none text-lg"
        />
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-10 flex flex-col items-center justify-center text-center space-y-5 min-h-[400px]">
        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-300">
          <Users size={45} />
        </div>
        <div className="max-w-md">
          <h3 className="text-xl font-bold text-stone-900">سجل الزبائن</h3>
          <p className="text-stone-500 mt-2 text-lg leading-relaxed">
            هنا تظهر قائمة بكافة الأشخاص المسجلين في النظام. يمكنك تعديل بياناتهم، رؤية عناوينهم (الشوارع)، أو تحويلهم لمشتركين دائمين.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 text-stone-400 text-sm italic">
            <Phone size={14} /> دعم التواصل السريع
          </div>
          <span className="text-stone-200">|</span>
          <div className="flex items-center gap-2 text-stone-400 text-sm italic">
            <MapPin size={14} /> فرز حسب المنطقة
          </div>
        </div>
      </div>
    </div>
  )
}

export default Customer