export type ToastType = "success" | "error" | "warning" | "info"

export interface ToastOptions {
  type: ToastType
  message: string
  title?: string
  duration?: number
}

export interface ToastItem extends ToastOptions {
  id: string
  duration: number
  createdAt: number
}

export interface ToastStore {
  toasts: ToastItem[]
  add: (options: ToastOptions) => void
  remove: (id: string) => void
}
