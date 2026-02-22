
import { ENDPOINTS } from "@/constants/endpoints.constant"
import { buildQuery, fetchApi } from "@/services/api/api.decoder"
import type { Client, ClientsData } from "@/types/client.types"

export const clientsService = {
  async getClients(params?: Record<string, string | number>) {
    const query = buildQuery(params)
    return fetchApi<ClientsData>(`${ENDPOINTS.CLIENTS}${query ? `?${query}` : ""}`)
  },

  async getClientById(id: string) {
    return fetchApi<Client>(`${ENDPOINTS.CLIENTS}/${id}`)
  },
}
