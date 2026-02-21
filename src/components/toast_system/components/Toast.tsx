"use client"

import { ToastItemComponent } from "@/components/toast_system/components/ToastItem"
import { useToastStore } from "@/components/toast_system/store/useToast.store"
import { AnimatePresence } from "framer-motion"
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

  const content = (
    <div className="pointer-events-none fixed top-6 right-6 z-[4000] flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItemComponent key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  )

  return createPortal(content, portalEl)
}
