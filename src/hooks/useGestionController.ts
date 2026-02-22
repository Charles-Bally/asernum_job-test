"use client"

import { dialog, DIALOG } from "@/components/dialog_system/services/dialog.service"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { accountEventsService } from "@/services/account-events/account-events.service"
import { apiRequest } from "@/services/api/api.request.service"
import { usersService } from "@/services/users/users.service"
import type { CreateUserPayload } from "@/types/user.types"
import { useQuery } from "@tanstack/react-query"
import { useCallback } from "react"

type UsersParams = {
  search: string
  role: string
  status: string
  page: number
  limit?: number
}

export function useUsersQuery({ search, role, status, page, limit = 10 }: UsersParams) {
  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.USERS, { search, role, status, page }],
    queryFn: () => usersService.getUsers({ search, role, status, page, limit }),
  })

  return {
    users: data?.rows ?? [],
    roles: data?.roles ?? [],
    page: data?.page ?? page,
    totalPages: data?.totalPages ?? 1,
    isLoading,
  }
}

export function useUserDetailQuery(id: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.USER_DETAIL, id],
    queryFn: () => usersService.getUserById(id),
    enabled: !!id,
  })
}

type EventsParams = {
  search: string
  action: string
  page: number
  limit?: number
}

export function useAccountEventsQuery({ search, action, page, limit = 10 }: EventsParams) {
  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.ACCOUNT_EVENTS, { search, action, page }],
    queryFn: () => accountEventsService.getEvents({ search, action, page, limit }),
  })

  return {
    events: data?.rows ?? [],
    page: data?.page ?? page,
    totalPages: data?.totalPages ?? 1,
    isLoading,
  }
}

export function useUserActions() {
  const blockUser = useCallback(async (id: string) => {
    const result = await dialog({
      type: DIALOG.DANGER,
      title: "Bloquer l'utilisateur",
      description: "Êtes-vous sûr de vouloir bloquer cet utilisateur ? Il ne pourra plus se connecter.",
      icon: { type: "lock" },
      buttons: [
        {
          label: "Annuler",
          action: "cancel",
          variant: "secondary",
        },
        {
          label: "Bloquer",
          action: "confirm",
          variant: "danger",
        },
      ],
    })
    if (result.action !== "confirm") return

    await apiRequest({
      request: () => usersService.blockUser(id),
      config: {
        waitingMessage: "Blocage en cours...",
        successMessage: "Utilisateur bloqué avec succès",
        cacheKeys: [QUERY_KEYS.USERS, QUERY_KEYS.USER_DETAIL],
      },
    })
  }, [])

  const unblockUser = useCallback(async (id: string) => {
    const result = await dialog({
      type: DIALOG.CONFIRM,
      title: "Débloquer l'utilisateur",
      description: "Êtes-vous sûr de vouloir débloquer cet utilisateur ?",
      icon: { type: "lockPrimary" },
      buttons: [
        {
          label: "Annuler",
          action: "cancel",
          variant: "secondary",
        },
        {
          label: "Débloquer",
          action: "confirm",
          variant: "primary",
        },
      ],
    })
    if (result.action !== "confirm") return

    await apiRequest({
      request: () => usersService.unblockUser(id),
      config: {
        waitingMessage: "Déblocage en cours...",
        successMessage: "Utilisateur débloqué avec succès",
        cacheKeys: [QUERY_KEYS.USERS, QUERY_KEYS.USER_DETAIL],
      },
    })
  }, [])

  const resetPassword = useCallback(async (id: string) => {
    const result = await dialog({
      type: DIALOG.WARNING,
      title: "Réinitialiser le mot de passe",
      description: "Un nouveau mot de passe sera généré et envoyé par email à l'utilisateur.",
      icon: { type: "warning" },
      buttons: [
        {
          label: "Annuler",
          action: "cancel",
          variant: "secondary",
        },
        {
          label: "Réinitialiser",
          action: "confirm",
          variant: "primary",
        },
      ],
    })
    if (result.action !== "confirm") return

    await apiRequest({
      request: () => usersService.resetPassword(id),
      config: {
        waitingMessage: "Réinitialisation en cours...",
        successTitle: "Email envoyé",
        successMessage: "Le nouveau mot de passe a été envoyé par email à l'utilisateur.",
        cacheKeys: [QUERY_KEYS.USERS, QUERY_KEYS.USER_DETAIL],
      },
    })
  }, [])

  const createUser = useCallback(async (payload: CreateUserPayload) => {
    return apiRequest({
      request: () => usersService.createUser(payload),
      config: {
        waitingMessage: "Création de l'utilisateur...",
        successTitle: "Compte créé",
        successMessage: "Le compte a été créé et le mot de passe envoyé par email.",
        cacheKeys: [QUERY_KEYS.USERS],
      },
    })
  }, [])

  return { blockUser, unblockUser, resetPassword, createUser }
}
