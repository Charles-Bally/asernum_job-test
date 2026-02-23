import { ENDPOINTS } from "@/constants/endpoints.constant"
import { http } from "@/services/http"
import { storageService } from "@/services/storage.service"
import { type AuthUser, useAuthStore } from "@/store/auth.store"
import { AxiosError } from "axios"

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = storageService.getJSON<string>("auth_refresh_token")
  if (!refreshToken) return false

  try {
    const res = await http.post(ENDPOINTS.AUTH.REFRESH, { refreshToken })
    const { accessToken, refreshToken: newRefreshToken } = res.data.data

    useAuthStore.getState().setToken(accessToken)
    storageService.setJSON("auth_refresh_token", newRefreshToken)
    return true
  } catch {
    return false
  }
}

export const profileService = {
  async getProfile(): Promise<AuthUser> {
    const res = await http.get(ENDPOINTS.AUTH.PROFILE)
    return res.data.data
  },

  async getProfileWithRefresh(): Promise<AuthUser> {
    try {
      return await this.getProfile()
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        const refreshed = await refreshAccessToken()
        if (refreshed) {
          return await this.getProfile()
        }
      }
      throw error
    }
  },

  async updateProfile(data: { firstName: string; lastName: string }) {
    const res = await http.patch(ENDPOINTS.AUTH.PROFILE, data)
    return res.data.data
  },

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    const res = await http.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, data)
    return res.data.data
  },
}
