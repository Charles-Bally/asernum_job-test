"use client"

import { SlidePanelLayout } from "@/components/menu/SlidePanelLayout"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/sidebar_system"
import { useToast } from "@/components/toast_system/hooks/useToast"
import { clientsService } from "@/services/clients/clients.service"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import type { SidebarComponentProps } from "../types/sidebar.types"

function formatAmount(amount: number): string {
  return `${amount.toLocaleString("fr-FR")} FCFA`
}

function ClientAvatar({ firstName, lastName }: { firstName: string; lastName: string }) {
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase()
  return (
    <div className="flex size-[48px] lg:size-[56px] shrink-0 items-center justify-center rounded-full bg-auchan-red">
      <span className="text-[18px] lg:text-[22px] font-bold text-white">{initials}</span>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 lg:py-[10px]">
      <span className="shrink-0 whitespace-nowrap text-[13px] lg:text-[14px] tracking-[-0.39px] lg:tracking-[-0.42px] text-text-secondary">
        {label}
      </span>
      <span className="text-[14px] lg:text-[16px] font-bold tracking-[-0.42px] lg:tracking-[-0.48px] text-foreground text-right break-all line-clamp-1">
        {value}
      </span>
    </div>
  )
}

export function ClientSidebarEntity({ config }: SidebarComponentProps) {
  const { close } = useSidebar()
  const { toast, TOAST } = useToast()

  const { data: client, isLoading, isError } = useQuery({
    queryKey: [...QUERY_KEYS.CLIENT_DETAIL, config.entityId],
    queryFn: () => clientsService.getClientById(config.entityId),
    enabled: !!config.entityId,
    retry: false,
  })

  useEffect(() => {
    if (isError || (!isLoading && !client)) {
      close()
      toast({ type: TOAST.ERROR, message: "Le client que vous recherchez n'est pas disponible, veuillez réessayer." })
    }
  }, [isError, isLoading, client, close, toast, TOAST])

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

  if (!client) return null

  const isActive = client.status === "active"

  return (
    <SlidePanelLayout
      title={
        <div className="flex items-center gap-3 lg:gap-[14px]">
          <ClientAvatar firstName={client.firstName} lastName={client.lastName} />
          <div className="flex flex-col">
            <h2 className="text-[20px] lg:text-[24px] font-bold tracking-[-0.6px] lg:tracking-[-0.72px] text-foreground">
              {client.firstName} {client.lastName}
            </h2>
            <span className="text-[13px] lg:text-[14px] font-medium tracking-[-0.39px] lg:tracking-[-0.42px] text-text-secondary">
              {client.phone}
            </span>
          </div>
        </div>
      }
    >
      <h3 className="mb-2.5 lg:mb-[12px] text-[17px] lg:text-[20px] font-bold tracking-[-0.51px] lg:tracking-[-0.6px] text-foreground">
        Informations
      </h3>

      <div className="flex flex-col divide-y divide-border-light rounded-[12px] lg:rounded-[14px] bg-surface-muted px-3.5 lg:px-[16px]">
        <InfoRow label="Magasin" value={client.store} />
        <InfoRow label="Dernière visite" value={client.lastVisit} />
        <div className="flex items-center justify-between py-2 lg:py-[10px]">
          <span className="text-[13px] lg:text-[14px] tracking-[-0.39px] lg:tracking-[-0.42px] text-text-secondary">
            Statut
          </span>
          <span className={cn(
            "rounded-full px-3 py-0.5 text-[12px] lg:text-[13px] font-bold",
            isActive ? "bg-auchan-green/10 text-auchan-green" : "bg-surface-muted text-text-secondary"
          )}>
            {isActive ? "Actif" : "Inactif"}
          </span>
        </div>
      </div>

      <div className="my-5 lg:my-[24px] h-px bg-border-light" />

      <h3 className="mb-2.5 lg:mb-[12px] text-[17px] lg:text-[20px] font-bold tracking-[-0.51px] lg:tracking-[-0.6px] text-foreground">
        Activité
      </h3>

      <div className="flex flex-col divide-y divide-border-light rounded-[12px] lg:rounded-[14px] bg-surface-muted px-3.5 lg:px-[16px]">
        <InfoRow label="Total achats" value={formatAmount(client.totalPurchases)} />
        <InfoRow label="Transactions" value={String(client.transactionCount)} />
      </div>
    </SlidePanelLayout>
  )
}
