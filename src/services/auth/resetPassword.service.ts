import { ENDPOINTS } from "@/constants/endpoints.constant"
import { http } from "@/services/http"

export const resetPasswordService = {
  async forgotPassword(email: string) {
    const response = await http.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
    return response.data
  },

  async verifyOtp(email: string, otp: string) {
    const response = await http.post(ENDPOINTS.AUTH.VERIFY_OTP, { email, otp })
    return response.data
  },

  async resetPassword(resetToken: string, password: string) {
    const response = await http.post(ENDPOINTS.AUTH.RESET_PASSWORD, { resetToken, password })
    return response.data
  },
}
