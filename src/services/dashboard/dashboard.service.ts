
import { ENDPOINTS } from "@/constants/endpoints.constant"
import { fetchApi } from "@/services/api/api.decoder"
import type { BalanceData, StatsData, TopStoresData } from "./dashboard.types"

export const dashboardService = {
  async getBalance() {
    return fetchApi<BalanceData>(ENDPOINTS.DASHBOARD.BALANCE)
  },

  async getTopStores() {
    return fetchApi<TopStoresData>(ENDPOINTS.DASHBOARD.TOP_STORES)
  },

  async getStats(period = "30days") {
    return fetchApi<StatsData>(`${ENDPOINTS.DASHBOARD.STATS}?period=${period}`)
  },
}
