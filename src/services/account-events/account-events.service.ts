import { ENDPOINTS } from "@/constants/endpoints.constant"
import { buildQuery, fetchApi } from "@/services/api/api.decoder"
import type { AccountEventsData } from "@/types/account-event.types"

export const accountEventsService = {
  async getEvents(params?: Record<string, string | number>) {
    const query = buildQuery(params)
    return fetchApi<AccountEventsData>(`${ENDPOINTS.ACCOUNT_EVENTS}${query ? `?${query}` : ""}`)
  },
}
