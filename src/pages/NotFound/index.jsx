import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileQuestion, Home, ArrowRight } from "lucide-react";

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-stone-50 p-4 font-cairo" dir="rtl">
            <div className="text-center space-y-6 max-w-md">

                <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-stone-200 flex items-center justify-center mx-auto animate-pulse">
                        <FileQuestion size={48} className="text-stone-500" />
                    </div>
                    <span className="absolute top-0 right-0 flex h-6 w-6">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-6 w-6 bg-red-500 text-[10px] text-white items-center justify-center">404</span>
                    </span>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-stone-900">عذراً، الصفحة غير موجودة!</h1>
                    <p className="text-stone-500 text-lg">
                        يبدو أنك حاولت الوصول إلى رابط غير صحيح أو تم نقل الصفحة إلى مكان آخر.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button
                        onClick={() => navigate("/")}
                        className="bg-black hover:bg-stone-800 text-white px-8 h-12 text-lg rounded-xl flex items-center gap-2"
                    >
                        <Home size={20} />
                        العودة للرئيسية
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="border-stone-300 px-8 h-12 text-lg rounded-xl flex items-center gap-2"
                    >
                        <ArrowRight size={20} />
                        رجوع للخلف
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default NotFound;