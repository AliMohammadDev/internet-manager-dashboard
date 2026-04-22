import React from 'react'
import { Users, UserPlus, Briefcase } from "lucide-react"

function Employee() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">إدارة الموظفين</h1>
          <p className="text-stone-500 mt-1">يمكنك هنا إضافة، تعديل، ومتابعة كافة الموظفين في النظام.</p>
        </div>
        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-stone-800 transition-colors cursor-pointer">
          <UserPlus size={20} />
          <span>إضافة موظف جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500">إجمالي الموظفين</p>
            <p className="text-2xl font-bold">24</p>
          </div>
        </div>


      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
          <Users size={32} />
        </div>
        <div>
          <h3 className="text-lg font-medium text-stone-900">لا يوجد بيانات لعرضها حالياً</h3>
          <p className="text-stone-500">ابدأ بإضافة موظفين لعرضهم في هذا الجدول.</p>
        </div>
      </div>
    </div>
  )
}

export default Employee