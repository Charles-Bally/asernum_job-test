"use client"

import { toast, TOAST } from "@/components/toast_system"
import { PATHNAME } from "@/constants/pathname.constant"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { loginService } from "@/services/auth/login.service"
import { storageService } from "@/services/storage.service"
import { useAuthStore } from "@/store/auth.store"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useRouter } from "next/navigation"

function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (error.response?.data as any)?.message || error.message
  }
  if (error instanceof Error) return error.message
  return "Une erreur est survenue"
}

export function useLoginController() {
  const router = useRouter()

  const loginMutation = useMutation({
    mutationKey: QUERY_KEYS.AUTH.LOGIN,
    mutationFn: async ({ identifier, password }: { identifier: string; password: string }) => {
      try {
        const response = await loginService.login(identifier, password)
        return response.data
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          throw new Error("Identifiants incorrects")
        }
        throw error
      }
    },
    onSuccess: (data) => {
      useAuthStore.getState().setToken(data.accessToken)
      storageService.setJSON("auth:refresh_token", data.refreshToken)
      toast({ type: TOAST.SUCCESS, message: "Connexion réussie" })
      router.push(PATHNAME.DASHBOARD.home)
    },
    onError: (error) => {
      toast({ type: TOAST.ERROR, message: extractErrorMessage(error) })
    },
  })

  const login = (identifier: string, password: string) =>
    loginMutation.mutate({ identifier, password })

  return {
    login,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error ? extractErrorMessage(loginMutation.error) : null,
    resetLoginError: loginMutation.reset,
  }
}
