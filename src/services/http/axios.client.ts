import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export type HttpMiddleware = {
  onRequest?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
  onResponse?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
  onError?: (error: AxiosError) => AxiosError | Promise<AxiosError>
}

export function createHttpClient(baseURL?: string, middlewares: HttpMiddleware[] = []): AxiosInstance {
  const instance = axios.create({ baseURL, withCredentials: false })

  instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    let cfg: InternalAxiosRequestConfig = config
    for (const mw of middlewares) {
      if (mw.onRequest) cfg = await mw.onRequest(cfg)
    }
    return cfg
  })

  instance.interceptors.response.use(async (response) => {
    let res = response
    for (const mw of middlewares) {
      if (mw.onResponse) res = await mw.onResponse(res)
    }
    return res
  }, async (error: AxiosError) => {
    let err = error
    for (const mw of middlewares) {
      if (mw.onError) err = await mw.onError(err)
    }
    return Promise.reject(err)
  })

  return instance
}

export const httpClient = createHttpClient()


