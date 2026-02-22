import { ENDPOINTS } from "@/constants/endpoints.constant"
import { buildQuery } from "@/services/api/api.decoder"
import { http } from "@/services/http"
import type { CreateStorePayload } from "@/types/store.types"
import type { StoreDetail, StoresData } from "./stores.types"

export const storesService = {
  async getStores(params?: Record<string, string | number>) {
    const query = buildQuery(params)
    const response = await http.get(`${ENDPOINTS.STORES}${query ? `?${query}` : ""}`)
    return response.data.data as StoresData
  },

  async getStoreById(id: string) {
    const response = await http.get(`${ENDPOINTS.STORES}/${id}`)
    return response.data.data as StoreDetail
  },

  async createStore(data: CreateStorePayload) {
    const response = await http.post(ENDPOINTS.STORES, data)
    return response.data.data
  },
}
