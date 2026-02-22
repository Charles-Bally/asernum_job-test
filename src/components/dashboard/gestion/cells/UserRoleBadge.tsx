"use client"

import { cn } from "@/lib/utils"
import { USER_ROLE_LABELS } from "@/types/user.types"
import type { UserRole } from "@/types/user.types"

const ROLE_STYLES: Record<UserRole, string> = {
  ADMIN: "bg-role-admin-light text-role-admin",
  MANAGER: "bg-role-manager-light text-role-manager",
  RESPONSABLE_CAISSES: "bg-role-resp-caisses-light text-role-resp-caisses",
  CAISSIER: "bg-role-caissier-light text-role-caissier",
}

export function UserRoleBadge({ role }: { role: UserRole }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-[12px] lg:text-[13px] font-bold",
      ROLE_STYLES[role]
    )}>
      {USER_ROLE_LABELS[role]}
    </span>
  )
}
