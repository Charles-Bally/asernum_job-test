"use client"

import { SlidePanelLayout } from "@/components/menu/SlidePanelLayout"
import CustomButton from "@/components/ui/render/CustomButton"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { useUserActions } from "@/hooks/useGestionController"
import { cn } from "@/lib/utils"
import { usersService } from "@/services/users/users.service"
import { USER_ROLE_LABELS } from "@/types/user.types"
import { useQuery } from "@tanstack/react-query"
import { Lock, RotateCcw, Unlock } from "lucide-react"
import { useCallback } from "react"
import type { SidebarComponentProps } from "../types/sidebar.types"

function UserAvatar({ firstName, lastName }: { firstName: string; lastName: string }) {
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase()
  return (
    <div className="flex size-[48px] lg:size-[56px] shrink-0 items-center justify-center rounded-full bg-auchan-red">
      <span className="text-[18px] lg:text-[22px] font-bold text-white">{initials}</span>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 lg:py-[10px]">
      <span className="text-[13px] lg:text-[14px] tracking-[-0.39px] lg:tracking-[-0.42px] text-text-secondary">{label}</span>
      <span className="text-[14px] lg:text-[16px] font-bold tracking-[-0.42px] lg:tracking-[-0.48px] text-foreground">{value}</span>
    </div>
  )
}

export function UserSidebarEntity({ config }: SidebarComponentProps) {
  const actions = useUserActions()

  const { data: user, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.USER_DETAIL, config.entityId],
    queryFn: () => usersService.getUserById(config.entityId),
    enabled: !!config.entityId,
  })

  const handleBlock = useCallback(() => {
    if (!user) return
    actions.blockUser(user.id)
  }, [user, actions])

  const handleUnblock = useCallback(() => {
    if (!user) return
    actions.unblockUser(user.id)
  }, [user, actions])

  const handleResetPassword = useCallback(() => {
    if (!user) return
    actions.resetPassword(user.id)
  }, [user, actions])

  if (isLoading) {
    return (
      <SlidePanelLayout title={<div className="h-[28px] lg:h-[32px] w-[160px] lg:w-[180px] animate-pulse rounded-[8px] lg:rounded-[10px] bg-surface-muted" />}>
        <div className="flex flex-col gap-3 lg:gap-[16px]">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-[36px] lg:h-[40px] animate-pulse rounded-[8px] lg:rounded-[10px] bg-surface-muted" />
          ))}
        </div>
      </SlidePanelLayout>
    )
  }

  if (!user) return null
  const isBlocked = user.status === "blocked"

  return (
    <SlidePanelLayout
      title={
        <div className="flex items-center gap-3 lg:gap-[14px]">
          <UserAvatar firstName={user.firstName} lastName={user.lastName} />
          <div className="flex flex-col">
            <h2 className="text-[20px] lg:text-[24px] font-bold tracking-[-0.6px] lg:tracking-[-0.72px] text-foreground">
              {user.firstName} {user.lastName}
            </h2>
            <span className="text-[13px] lg:text-[14px] font-medium tracking-[-0.39px] lg:tracking-[-0.42px] text-auchan-red">
              {USER_ROLE_LABELS[user.role]}
            </span>
          </div>
        </div>
      }
    >
      <h3 className="mb-2.5 lg:mb-[12px] text-[17px] lg:text-[20px] font-bold tracking-[-0.51px] lg:tracking-[-0.6px] text-foreground">
        Informations
      </h3>

      <div className="flex flex-col divide-y divide-border-light rounded-[12px] lg:rounded-[14px] bg-surface-muted px-3.5 lg:px-[16px]">
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="Magasin" value={user.store ?? "Non assigné"} />
        <InfoRow label="Date de création" value={user.createdAt} />
        <div className="flex items-center justify-between py-2 lg:py-[10px]">
          <span className="text-[13px] lg:text-[14px] tracking-[-0.39px] lg:tracking-[-0.42px] text-text-secondary">Statut</span>
          <span className={cn(
            "rounded-full px-3 py-0.5 text-[12px] lg:text-[13px] font-bold",
            isBlocked ? "bg-auchan-red-light text-auchan-red" : "bg-auchan-green/10 text-auchan-green"
          )}>
            {isBlocked ? "Bloqué" : "Actif"}
          </span>
        </div>
      </div>

      {isBlocked && user.blockReason && (
        <div className="mt-3 lg:mt-[16px] rounded-[10px] bg-auchan-red-light px-3.5 lg:px-[16px] py-2.5 lg:py-[12px]">
          <p className="text-[12px] lg:text-[13px] font-medium text-auchan-red">
            Raison : {user.blockReason}
          </p>
        </div>
      )}

      <div className="my-5 lg:my-[24px] h-px bg-border-light" />

      <h3 className="mb-3 lg:mb-[16px] text-[17px] lg:text-[20px] font-bold tracking-[-0.51px] lg:tracking-[-0.6px] text-foreground">
        Actions
      </h3>

      <div className="flex flex-col gap-2 lg:gap-[10px]">
        {isBlocked ? (
          <CustomButton variant="outline" size="md" onClick={handleUnblock} className="w-full justify-center gap-2">
            <Unlock size={16} /> Débloquer
          </CustomButton>
        ) : (
          <CustomButton variant="danger" size="md" onClick={handleBlock} className="w-full justify-center gap-2">
            <Lock size={16} /> Bloquer
          </CustomButton>
        )}
        <CustomButton variant="secondary" size="md" onClick={handleResetPassword} className="w-full justify-center gap-2">
          <RotateCcw size={16} /> Réinitialiser le mot de passe
        </CustomButton>
      </div>
    </SlidePanelLayout>
  )
}
