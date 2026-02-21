
import { ENDPOINTS } from "@/constants/endpoints.constant"
import { buildQuery, fetchApi } from "@/services/api/api.decoder"
import type { StoresData } from "./stores.types"

export const storesService = {
  async getStores(params?: Record<string, string | number>) {
    const query = buildQuery(params)
    return fetchApi<StoresData>(`${ENDPOINTS.STORES}${query ? `?${query}` : ""}`)
  },
}
