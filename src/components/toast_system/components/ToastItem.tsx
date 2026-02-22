"use client"

import { useToastStore } from "@/components/toast_system/store/useToast.store"
import type { ToastItem as ToastItemType, ToastType } from "@/components/toast_system/types/toast.types"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const dotColors: Record<ToastType, string> = {
  success: "bg-auchan-green",
  error: "bg-auchan-red",
  warning: "bg-toast-warning",
  info: "bg-toast-info",
}

const progressColors: Record<ToastType, string> = {
  success: "bg-auchan-green",
  error: "bg-auchan-red",
  warning: "bg-toast-warning",
  info: "bg-toast-info",
}

const defaultTitles: Record<ToastType, string> = {
  success: "Succès",
  error: "Erreur",
  warning: "Attention",
  info: "Information",
}

export function ToastItemComponent({ toast }: { toast: ToastItemType }) {
  const dismiss = useToastStore((s) => s.dismiss)
  const title = toast.title ?? defaultTitles[toast.type]
  const isExiting = toast.exiting ?? false

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={
        isExiting
          ? { opacity: 0, y: 10, scale: 0.97, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }
          : { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 380, damping: 28 } }
      }
      className="pointer-events-auto relative w-full lg:w-[320px] overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        {/* Dot */}
        <div className={cn("mt-[7px] size-2 shrink-0 rounded-full", dotColors[toast.type])} />

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-gray-900 leading-tight">
            {title}
          </p>
          <p className="mt-0.5 text-[12px] text-gray-500 leading-snug">
            {toast.message}
          </p>
        </div>

        {/* Close */}
        <button
          onClick={() => dismiss(toast.id)}
          className="shrink-0 mt-0.5 flex size-6 cursor-pointer items-center justify-center rounded-full text-gray-300 transition-colors hover:bg-gray-100 hover:text-gray-500"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Progress */}
      <div className="h-[2px] bg-gray-100">
        <motion.div
          className={cn("h-full rounded-full", progressColors[toast.type])}
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: toast.duration / 1000, ease: "linear" }}
          style={{ transformOrigin: "left" }}
        />
      </div>
    </motion.div>
  )
}
