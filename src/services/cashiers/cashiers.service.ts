import { ENDPOINTS } from "@/constants/endpoints.constant"
import { buildQuery, fetchApi } from "@/services/api/api.decoder"
import type { CashierRow, CashiersData } from "./cashiers.types"

export const cashiersService = {
  async getCashiers(params?: Record<string, string | number>) {
    const query = buildQuery(params)
    return fetchApi<CashiersData>(`${ENDPOINTS.CASHIERS}${query ? `?${query}` : ""}`)
  },

  async getCashierById(id: string, storeCode?: string) {
    const query = storeCode ? `?storeCode=${storeCode}` : ""
    return fetchApi<CashierRow>(`${ENDPOINTS.CASHIERS}/${id}${query}`)
  },
}
