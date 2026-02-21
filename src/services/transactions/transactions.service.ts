
import { ENDPOINTS } from "@/constants/endpoints.constant"
import { buildQuery, fetchApi } from "@/services/api/api.decoder"
import type { TransactionsData } from "./transactions.types"

export const transactionsService = {
  async getTransactions(params?: Record<string, string | number>) {
    const query = buildQuery(params)
    return fetchApi<TransactionsData>(`${ENDPOINTS.TRANSACTIONS}${query ? `?${query}` : ""}`)
  },
}
