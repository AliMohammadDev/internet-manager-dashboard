import React from 'react'
import { ArrowUpRight, Plus, Receipt, Wallet, TrendingUp } from "lucide-react"

function Expense() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-stone-900">إدارة المصروفات</h1>
                    <p className="text-stone-500 mt-1">تسجيل ومتابعة كافة المصاريف التشغيلية وصيانة الشبكة.</p>
                </div>
                <button className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-md hover:bg-red-700 transition-colors cursor-pointer font-bold shadow-sm">
                    <Plus size={20} />
                    <span>إضافة مصروف جديد</span>
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                        <ArrowUpRight size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-stone-500 font-medium">مصاريف الشهر</p>
                        <p className="text-2xl font-bold">1.2M ل.س</p>
                    </div>
                </div>

                <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-stone-50 text-stone-600 rounded-full flex items-center justify-center">
                        <Receipt size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-stone-500 font-medium">عدد الفواتير</p>
                        <p className="text-2xl font-bold">45</p>
                    </div>
                </div>

                <div className="p-5 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-stone-500 font-medium">أعلى بند صرف</p>
                        <p className="text-xl font-bold">صيانة أبراج</p>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="bg-white border border-stone-200 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[350px]">
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-300">
                    <Wallet size={40} />
                </div>
                <div className="max-w-sm">
                    <h3 className="text-xl font-bold text-stone-900">سجل المصروفات فارغ</h3>
                    <p className="text-stone-500 mt-2 text-lg">
                        ابدأ بتسجيل المصاريف اليومية لتتمكن من مراقبة أرباحك بدقة.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Expense