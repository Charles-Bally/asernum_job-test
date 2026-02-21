import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export const defaultMiddleware = {
  onRequest: async (config: InternalAxiosRequestConfig) => {
    return config
  },
  onResponse: async (response: AxiosResponse) => {
    return response
  },
  onError: async (error: AxiosError) => {
    return error
  },
}


