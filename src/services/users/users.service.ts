import { ENDPOINTS } from "@/constants/endpoints.constant"
import { buildQuery, fetchApi } from "@/services/api/api.decoder"
import { http } from "@/services/http"
import type { User, UsersData, CreateUserPayload, UpdateUserPayload } from "@/types/user.types"

export const usersService = {
  async getUsers(params?: Record<string, string | number>) {
    const query = buildQuery(params)
    return fetchApi<UsersData>(`${ENDPOINTS.USERS}${query ? `?${query}` : ""}`)
  },

  async getUserById(id: string) {
    return fetchApi<User>(`${ENDPOINTS.USERS}/${id}`)
  },

  async createUser(payload: CreateUserPayload) {
    return http.post(ENDPOINTS.USERS, payload)
  },

  async blockUser(id: string) {
    return http.patch(`${ENDPOINTS.USERS}/${id}`, { action: "block" })
  },

  async unblockUser(id: string) {
    return http.patch(`${ENDPOINTS.USERS}/${id}`, { action: "unblock" })
  },

  async resetPassword(id: string) {
    return http.patch(`${ENDPOINTS.USERS}/${id}`, { action: "reset-password" })
  },

  async updateUser(id: string, payload: UpdateUserPayload) {
    return http.patch(`${ENDPOINTS.USERS}/${id}`, { action: "update-profile", ...payload })
  },
}
