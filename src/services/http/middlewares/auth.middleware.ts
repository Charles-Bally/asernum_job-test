import { storageService } from '@/services/storage.service';
import { AxiosError, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export const authMiddleware = {
  onRequest: async (config: InternalAxiosRequestConfig) => {
    const token = storageService.getJSON<string>('auth:access_token')
    if (token) {
      const headers: Record<string, string> = config.headers || {}
      headers['Authorization'] = `Bearer ${token}`
      config.headers = headers as AxiosRequestHeaders
    }
    return config
  },
  onResponse: async (response: AxiosResponse) => response,
  onError: async (error: AxiosError) => error,
}


