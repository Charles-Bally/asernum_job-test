"use client"

import { cn } from "@/lib/utils"
import type { UserStatus } from "@/types/user.types"

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const isActive = status === "active"

  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] lg:text-[13px] font-bold",
      isActive ? "bg-auchan-green/10 text-auchan-green" : "bg-auchan-red-light text-auchan-red"
    )}>
      {isActive ? "Actif" : "Bloqué"}
    </span>
  )
}
