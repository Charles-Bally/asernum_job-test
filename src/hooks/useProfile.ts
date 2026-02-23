import { toast, TOAST } from "@/components/toast_system"
import { PATHNAME } from "@/constants/pathname.constant"
import { profileService } from "@/services/auth/profile.service"
import { type AuthUser, useAuthStore } from "@/store/auth.store"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef } from "react"

export function useProfile() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const setUser = useAuthStore((s) => s.setUser)
  const logout = useAuthStore((s) => s.logout)
  const router = useRouter()
  const queryClient = useQueryClient()
  const hasLoggedOut = useRef(false)

  const handleSessionExpired = useCallback(() => {
    if (hasLoggedOut.current) return
    hasLoggedOut.current = true

    logout()
    queryClient.removeQueries({ queryKey: ["auth", "profile"] })
    toast({ type: TOAST.ERROR, title: "Session expirée", message: "Veuillez vous reconnecter" })
    router.replace(PATHNAME.LOGIN)
  }, [logout, router, queryClient])

  const handleAccessDenied = useCallback((error: unknown) => {
    if (hasLoggedOut.current) return
    hasLoggedOut.current = true

    const serverMessage = error instanceof AxiosError
      ? (error.response?.data as any)?.error
      : null
    const message = serverMessage || "Accès refusé. Veuillez contacter un administrateur."

    logout()
    queryClient.removeQueries({ queryKey: ["auth", "profile"] })
    toast({ type: TOAST.ERROR, message })
    router.replace(PATHNAME.LOGIN)
  }, [logout, router, queryClient])

  useEffect(() => {
    if (!isAuthenticated) {
      hasLoggedOut.current = true
      queryClient.removeQueries({ queryKey: ["auth", "profile"] })
    }
  }, [isAuthenticated, queryClient])

  const query = useQuery<AuthUser>({
    queryKey: ["auth", "profile"],
    queryFn: () => profileService.getProfileWithRefresh(),
    enabled: isAuthenticated,
    refetchInterval: 30_000,
    retry: 0,
  })

  useEffect(() => {
    if (query.data) {
      setUser(query.data)
      hasLoggedOut.current = false
    }
  }, [query.data, setUser])

  useEffect(() => {
    if (query.error && isAuthenticated && !hasLoggedOut.current) {
      const is403 = query.error instanceof AxiosError && query.error.response?.status === 403
      if (is403) {
        handleAccessDenied(query.error)
      } else {
        handleSessionExpired()
      }
    }
  }, [query.error, isAuthenticated, handleSessionExpired, handleAccessDenied])

  return query
}
