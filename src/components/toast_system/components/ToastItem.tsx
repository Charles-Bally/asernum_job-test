"use client"

import { useToastStore } from "@/components/toast_system/store/useToast.store"
import type { ToastItem as ToastItemType } from "@/components/toast_system/types/toast.types"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { CheckCircle, Info, AlertTriangle, XCircle, X } from "lucide-react"

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const accentColors = {
  success: "bg-auchan-green",
  error: "bg-auchan-red",
  warning: "bg-toast-warning",
  info: "bg-toast-info",
}

const iconColors = {
  success: "text-auchan-green",
  error: "text-auchan-red",
  warning: "text-toast-warning",
  info: "text-toast-info",
}

const defaultTitles = {
  success: "Succès",
  error: "Erreur",
  warning: "Attention",
  info: "Information",
}

export function ToastItemComponent({ toast }: { toast: ToastItemType }) {
  const remove = useToastStore((s) => s.remove)
  const Icon = iconMap[toast.type]
  const title = toast.title ?? defaultTitles[toast.type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8, scale: 0.96, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.92, filter: "blur(4px)", transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className="pointer-events-auto relative w-[340px] overflow-hidden rounded-xl bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-center gap-3 px-4 py-3.5">
        <Icon className={cn("h-[18px] w-[18px] shrink-0", iconColors[toast.type])} />

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-foreground leading-tight">{title}</p>
          <p className="mt-0.5 text-[12px] text-text-tertiary leading-snug">{toast.message}</p>
        </div>

        <button
          onClick={() => remove(toast.id)}
          className="shrink-0 cursor-pointer rounded-full p-1 text-text-muted/60 transition-colors hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <motion.div
        className={cn("h-[2px]", accentColors[toast.type])}
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: toast.duration / 1000, ease: "linear" }}
        style={{ transformOrigin: "left" }}
      />
    </motion.div>
  )
}
