import { toast, TOAST } from "@/components/toast_system/services/toast.service"

export function useToast() {
  return { toast, TOAST }
}
