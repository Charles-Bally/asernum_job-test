import { useToastStore } from "@/components/toast_system/store/useToast.store"
import type { ToastOptions, ToastType } from "@/components/toast_system/types/toast.types"

export function toast(options: ToastOptions): void {
  useToastStore.getState().add(options)
}

export const TOAST: Record<string, ToastType> = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
}
