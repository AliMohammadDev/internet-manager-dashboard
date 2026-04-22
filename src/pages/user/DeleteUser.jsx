import React from 'react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2, Trash2, AlertTriangle, X } from "lucide-react"
import { useDeleteUser } from '@/api/user';

function DeleteUser({ userId, open, setOpen }) {
  const deleteMutation = useDeleteUser();

  const onConfirmDelete = () => {
    deleteMutation.mutate(userId, {
      onSuccess: () => {
        setOpen(false);
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="font-cairo max-w-112.5 p-0 overflow-hidden border-none shadow-2xl" dir="rtl">

        <div className="bg-red-50 p-6 flex flex-col items-center justify-center border-b border-red-100">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <AlertTriangle size={32} className="text-red-600 animate-pulse" />
          </div>
          <AlertDialogTitle className="text-2xl font-black text-red-900 font-cairo">
            تأكيد الحذف النهائي
          </AlertDialogTitle>
        </div>

        <div className="p-8">
          <AlertDialogHeader className="text-right p-0">
            <AlertDialogDescription className="text-stone-600 text-lg leading-relaxed font-medium text-center font-cairo">
              هل أنت متأكد من رغبتك في حذف هذا الحساب؟
              <br />

            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex flex-col sm:flex-row-reverse gap-4 mt-8">
            <button
              onClick={onConfirmDelete}
              disabled={deleteMutation.isPending}
              className="w-full sm:flex-2 bg-red-600 text-white h-12 rounded-2xl font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed font-cairo text-base"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Trash2 size={20} />
              )}
              <span>نعم، احذف الحساب</span>
            </button>

            <AlertDialogCancel
              className="w-full sm:flex-1 h-12 rounded-2xl border-stone-200 text-stone-500 font-bold hover:bg-stone-50 hover:text-stone-700 transition-all font-cairo text-base m-0 border shadow-sm"
            >
              إلغاء
            </AlertDialogCancel>
          </AlertDialogFooter>
        </div>

        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 left-4 text-red-300 hover:text-red-600 transition-colors p-1"
        >
          <X size={18} />
        </button>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteUser