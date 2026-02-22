"use client"

import { cn } from "@/lib/utils"
import { EVENT_ACTION_LABELS } from "@/types/account-event.types"
import type { EventAction } from "@/types/account-event.types"
import { Lock, Plus, RotateCcw, ShieldCheck, Store, Unlock } from "lucide-react"

const ACTION_CONFIG: Record<EventAction, { icon: typeof Plus; color: string }> = {
  CREATED: { icon: Plus, color: "text-auchan-green" },
  BLOCKED: { icon: Lock, color: "text-auchan-red" },
  UNBLOCKED: { icon: Unlock, color: "text-auchan-green" },
  PASSWORD_RESET: { icon: RotateCcw, color: "text-toast-warning" },
  ROLE_CHANGED: { icon: ShieldCheck, color: "text-toast-info" },
  ASSIGNED_STORE: { icon: Store, color: "text-role-manager" },
}

export function EventActionLabel({ action }: { action: EventAction }) {
  const config = ACTION_CONFIG[action]
  const Icon = config.icon

  return (
    <div className="flex items-center gap-2">
      <Icon size={15} className={cn(config.color)} />
      <span className="text-[13px] lg:text-[16px] font-medium tracking-[-0.39px] lg:tracking-[-0.48px] text-foreground">
        {EVENT_ACTION_LABELS[action]}
      </span>
    </div>
  )
}
