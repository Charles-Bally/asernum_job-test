"use client"

import { cn } from "@/lib/utils"
import type { ClientStatus } from "@/types/client.types"

export function ClientStatusBadge({ status }: { status: ClientStatus }) {
  const isActive = status === "active"

  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] lg:text-[13px] font-bold",
      isActive ? "bg-auchan-green/10 text-auchan-green" : "bg-surface-muted text-text-secondary"
    )}>
      {isActive ? "Actif" : "Inactif"}
    </span>
  )
}
