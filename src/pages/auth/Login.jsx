import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wifi, Lock } from "lucide-react"
import { useForm } from 'react-hook-form'
import { useUserLogin } from '@/api/auth'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { EyeOff } from 'lucide-react'
import { Eye } from 'lucide-react'

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const loginMutation = useUserLogin();

  const onSubmit = (data) => {
    loginMutation.mutate(data);
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-stone-50 p-4" dir="rtl">

      <div className="w-full max-w-md mx-auto space-y-6">

        <div className="text-center flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg">
            <Wifi size={32} />
          </div>
          <h1 className="text-2xl font-bold text-stone-950">نظام إدارة الشبكة</h1>
          <p className="text-stone-600 text-sm">أهلاً بك مجدداً، يرجى تسجيل الدخول للمتابعة</p>
        </div>

        <Card className="border-stone-200 shadow-xl bg-white rounded-2xl">
          <CardHeader className="space-y-1 text-right border-b border-stone-100 p-6">
            <CardTitle className="text-xl font-black flex items-center gap-2 font-cairo">
              <Lock size={18} className="text-stone-400" />
              تسجيل الدخول
            </CardTitle>
            <CardDescription className="text-stone-500">
              أدخل بيانات الحساب الخاص بك للوصول للوحة التحكم.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 p-6 pt-6">

              <div className="space-y-2 text-right">
                <Label htmlFor="email" className="font-bold text-stone-800">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", { required: "البريد الإلكتروني مطلوب" })}
                  className={`p-3 border-stone-200 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
              </div>

              <div className="space-y-2 text-right">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="font-bold text-stone-800">كلمة المرور</Label>
                  <a href="#" className="text-sm text-stone-500 hover:text-black hover:underline">
                    نسيت كلمة المرور؟
                  </a>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: "كلمة المرور مطلوبة" })}
                    className={`p-3 pl-10 border-stone-200 ${errors.password ? 'border-red-500' : ''}`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-2 border-t border-stone-100">
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full h-12 text-lg font-bold bg-black text-white hover:bg-stone-800 rounded-lg cursor-pointer"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الدخول...
                  </>
                ) : (
                  "دخول "
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>


      </div>
    </div>
  );
}

export default Login;