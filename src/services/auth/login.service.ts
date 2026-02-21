import { ENDPOINTS } from "@/constants/endpoints.constant"
import { http } from "@/services/http"

export const loginService = {
  async login(identifier: string, password: string) {
    const response = await http.post(ENDPOINTS.AUTH.LOGIN, { identifier, password })
    return response.data
  },
}
