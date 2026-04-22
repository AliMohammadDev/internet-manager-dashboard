import React from 'react'
import { CreditCard, Search, Download, CheckCircle } from "lucide-react"

function Payment() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-900">سجل المدفوعات</h1>
        <p className="text-stone-500 mt-1">تتبع كافة المبالغ المستلمة من المشتركين.</p>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
          <h3 className="font-bold text-stone-700">آخر العمليات</h3>
          <button className="text-sm flex items-center gap-2 text-stone-600 hover:text-black transition-colors cursor-pointer font-medium">
            <Download size={16} /> تحميل كشف
          </button>
        </div>
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} />
          </div>
          <p className="text-stone-500">تمت معالجة كافة المدفوعات بنجاح اليوم.</p>
        </div>
      </div>
    </div>
  )
}

export default Payment