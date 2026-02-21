"use client"

import { toast, TOAST } from "@/components/toast_system"
import { PATHNAME } from "@/constants/pathname.constant"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { resetPasswordService } from "@/services/auth/resetPassword.service"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useRouter } from "next/navigation"

const STORAGE_KEYS = {
  EMAIL: "reset-password:email",
  TOKEN: "reset-password:token",
} as const

function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (error.response?.data as any)?.message || error.message
  }
  if (error instanceof Error) return error.message
  return "Une erreur est survenue"
}

export function useResetPasswordController() {
  const router = useRouter()

  const sendOtpMutation = useMutation({
    mutationKey: QUERY_KEYS.AUTH.FORGOT_PASSWORD,
    mutationFn: async (email: string) => {
      const response = await resetPasswordService.forgotPassword(email)
      return response.data
    },
    onSuccess: (_data, email) => {
      sessionStorage.setItem(STORAGE_KEYS.EMAIL, email)
      router.push(PATHNAME.OTP)
    },
  })

  const verifyOtpMutation = useMutation({
    mutationKey: QUERY_KEYS.AUTH.VERIFY_OTP,
    mutationFn: async (otp: string) => {
      const email = sessionStorage.getItem(STORAGE_KEYS.EMAIL)
      if (!email) throw new Error("Email introuvable. Veuillez recommencer.")
      try {
        const response = await resetPasswordService.verifyOtp(email, otp)
        return response.data
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 400) {
          throw new Error("OTP invalide")
        }
        throw error
      }
    },
    onSuccess: (data) => {
      sessionStorage.setItem(STORAGE_KEYS.TOKEN, data.resetToken)
      router.push(PATHNAME.NEW_PASSWORD)
    },
  })

  const resetPasswordMutation = useMutation({
    mutationKey: QUERY_KEYS.AUTH.RESET_PASSWORD,
    mutationFn: async (password: string) => {
      const resetToken = sessionStorage.getItem(STORAGE_KEYS.TOKEN)
      if (!resetToken) throw new Error("Token introuvable. Veuillez recommencer.")
      const response = await resetPasswordService.resetPassword(resetToken, password)
      return response.data
    },
    onSuccess: () => {
      sessionStorage.removeItem(STORAGE_KEYS.EMAIL)
      sessionStorage.removeItem(STORAGE_KEYS.TOKEN)
      toast({ type: TOAST.SUCCESS, message: "Votre mot de passe a été changé avec succès." })
      router.push(PATHNAME.LOGIN)
    },
  })

  const sendOtp = (email: string) => sendOtpMutation.mutate(email)
  const verifyOtp = (otp: string) => verifyOtpMutation.mutate(otp)
  const resetPassword = (password: string) => resetPasswordMutation.mutate(password)

  const resendOtp = () => {
    const email = sessionStorage.getItem(STORAGE_KEYS.EMAIL)
    if (email) sendOtpMutation.mutate(email)
  }

  return {
    sendOtp,
    verifyOtp,
    resetPassword,
    resendOtp,
    isSendingOtp: sendOtpMutation.isPending,
    isVerifyingOtp: verifyOtpMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    resetVerifyOtpError: verifyOtpMutation.reset,
    sendOtpError: sendOtpMutation.error ? extractErrorMessage(sendOtpMutation.error) : null,
    verifyOtpError: verifyOtpMutation.error ? extractErrorMessage(verifyOtpMutation.error) : null,
    resetPasswordError: resetPasswordMutation.error ? extractErrorMessage(resetPasswordMutation.error) : null,
  }
}
