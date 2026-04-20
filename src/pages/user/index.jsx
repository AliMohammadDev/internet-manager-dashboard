import React from 'react'
import { Users, UserPlus, ShieldCheck, UserX, Search, Filter } from "lucide-react"

function User() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-stone-900">إدارة المشتركين</h1>
                    <p className="text-stone-500 mt-1">عرض بيانات مستخدمي الشبكة وإدارة حساباتهم وتفعيلها.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-stone-100 text-stone-700 px-4 py-2 rounded-md hover:bg-stone-200 transition-colors cursor-pointer font-bold">
                        <Filter size={18} />
                        <span>تصفية</span>
                    </button>
                    <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-stone-800 transition-colors cursor-pointer font-bold">
                        <UserPlus size={18} />
                        <span>إنشاء حساب جديد</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-stone-500">إجمالي المشتركين</p>
                        <p className="text-2xl font-bold">1,250</p>
                    </div>
                </div>

                <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-stone-500">اشتراكات نشطة</p>
                        <p className="text-2xl font-bold">980</p>
                    </div>
                </div>

                <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
                        <UserX size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-stone-500">اشتراكات منتهية</p>
                        <p className="text-2xl font-bold">270</p>
                    </div>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                <input
                    type="text"
                    placeholder="ابحث عن مستخدم برقم الهاتف أو الاسم..."
                    className="w-full p-3 pr-10 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-200 transition-all bg-white text-lg"
                />
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[350px]">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                    <Users size={32} />
                </div>
                <div>
                    <h3 className="text-lg font-medium text-stone-900">قائمة المستخدمين فارغة</h3>
                    <p className="text-stone-500 text-lg">لم يتم إضافة مستخدمين بعد. ابدأ بإنشاء أول حساب مشترك.</p>
                </div>
            </div>
        </div>
    )
}

export default User