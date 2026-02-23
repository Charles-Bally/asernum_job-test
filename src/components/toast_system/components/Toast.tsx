"use client"

import { ToastItemComponent } from "@/components/toast_system/components/ToastItem"
import { useToastStore } from "@/components/toast_system/store/useToast.store"
import { cn } from "@/lib/utils"
import { useSyncExternalStore } from "react"
import { createPortal } from "react-dom"

export function Toast() {
  const portalEl = useSyncExternalStore(
    () => () => {},
    () => {
      let el = document.getElementById("toast-root")
      if (!el) {
        el = document.createElement("div")
        el.setAttribute("id", "toast-root")
        document.body.appendChild(el)
      }
      return el
    },
    () => null,
  )

  const toasts = useToastStore((s) => s.toasts)

  if (!portalEl || toasts.length === 0) return null

  return createPortal(
    <div
      className={cn(
        "pointer-events-none fixed z-[4000] flex gap-2.5",
        "flex-col-reverse bottom-5 inset-x-4 items-center",
        "lg:flex-col lg:top-6 lg:right-6 lg:bottom-auto lg:left-auto lg:items-end"
      )}
    >
      {toasts.map((toast) => (
        <ToastItemComponent key={toast.id} toast={toast} />
      ))}
    </div>,
    portalEl
  )
}
