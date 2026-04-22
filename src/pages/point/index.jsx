import React from 'react'
import { Wifi, Plus, MapPin, SignalHigh, Server } from "lucide-react"

function Point() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">إدارة نقاط البث</h1>
          <p className="text-stone-500 mt-1">متابعة نقاط تقوية الشبكة الموزعة في الشوارع والمناطق.</p>
        </div>
        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-stone-800 transition-colors cursor-pointer font-bold">
          <Plus size={20} />
          <span>إضافة نقطة بث</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <Server size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500">إجمالي النقاط</p>
            <p className="text-2xl font-bold">12</p>
          </div>
        </div>

        <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
            <SignalHigh size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500">نقاط نشطة (Online)</p>
            <p className="text-2xl font-bold">10</p>
          </div>
        </div>

        <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
            <activity size={24} />
          </div>
          <div>
            <p className="text-sm text-stone-500">نقاط خارج الخدمة</p>
            <p className="text-2xl font-bold">2</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
          <MapPin size={32} />
        </div>
        <div>
          <h3 className="text-lg font-medium text-stone-900">لم يتم تحديد مواقع النقاط بعد</h3>
          <p className="text-stone-500 text-lg">يمكنك هنا إضافة المواقع الجغرافية (الشوارع) لكل نقطة تقوية.</p>
        </div>
        <div className="flex gap-4">
          <button className="text-sm font-bold bg-stone-100 px-4 py-2 rounded-md hover:bg-stone-200 transition-all cursor-pointer">
            عرض الخريطة
          </button>
        </div>
      </div>
    </div>
  )
}

export default Point