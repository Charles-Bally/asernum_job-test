import type { ToastItem, ToastOptions, ToastStore } from "@/components/toast_system/types/toast.types"
import { create } from "zustand"

const MAX_TOASTS = 3
const DEFAULT_DURATION = 4000

let toastCounter = 0
const timers = new Map<string, ReturnType<typeof setTimeout>>()

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  add: (options: ToastOptions) => {
    const id = `toast-${++toastCounter}`
    const duration = options.duration ?? DEFAULT_DURATION

    const item: ToastItem = {
      ...options,
      id,
      duration,
      createdAt: Date.now(),
    }

    set((state) => {
      const next = [...state.toasts, item]
      if (next.length > MAX_TOASTS) {
        const removed = next.shift()!
        const timer = timers.get(removed.id)
        if (timer) {
          clearTimeout(timer)
          timers.delete(removed.id)
        }
      }
      return { toasts: next }
    })

    const timer = setTimeout(() => {
      get().remove(id)
    }, duration)
    timers.set(id, timer)
  },

  remove: (id: string) => {
    const timer = timers.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.delete(id)
    }
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },
}))
