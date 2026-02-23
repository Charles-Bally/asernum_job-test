import { storageService } from '@/services/storage.service';
import { useAuthStore } from '@/store/auth.store';
import { AxiosError, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

function isAuthRoute(url?: string): boolean {
  return !!url && url.includes("/auth/")
}

export const authMiddleware = {
  onRequest: async (config: InternalAxiosRequestConfig) => {
    const token = storageService.getJSON<string>('auth:token')
    if (token) {
      const headers: Record<string, string> = config.headers || {}
      headers['Authorization'] = `Bearer ${token}`
      config.headers = headers as AxiosRequestHeaders
    }
    return config
  },
  onResponse: async (response: AxiosResponse) => response,
  onError: async (error: AxiosError) => {
    if (error.response?.status === 403 && !isAuthRoute(error.config?.url)) {
      const { toast, TOAST } = await import('@/components/toast_system')
      const message = (error.response.data as any)?.error
        || "Vous n'avez pas les droits pour accéder à cette ressource."
      useAuthStore.getState().logout()
      toast({ type: TOAST.ERROR, message })
      window.location.replace("/auth/login")
    }
    return error
  },
}


