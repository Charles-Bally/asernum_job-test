"use client"

import { cn } from "@/lib/utils"
import type { CashierRow } from "@/services/cashiers/cashiers.types"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import {
  EditSolidIcon,
  ExchangeFilledIcon,
  ListUlIcon,
  UserBlockedIcon,
} from "./CashierActionIcons"

export function AccessKeyCell({ row }: { row: CashierRow }) {
  const [visible, setVisible] = useState(row.showKey)

  return (
    <div className="flex items-center gap-[10px]">
      <span className="inline-flex w-[56px] text-[16px] font-medium text-foreground">
        {visible ? (
          <span className="tracking-[4px]">{row.accessKey}</span>
        ) : (
          <span className="flex items-center gap-[6px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                className="inline-block size-[8px] shrink-0 rounded-full bg-foreground"
              />
            ))}
          </span>
        )}
      </span>
      <button
        type="button"
        onClick={() => setVisible((p) => !p)}
        className={cn(
          "flex size-[19px] shrink-0 cursor-pointer items-center justify-center",
          "rounded-full bg-auchan-red/10 text-auchan-red"
        )}
      >
        {visible ? <EyeOff size={11} /> : <Eye size={11} />}
      </button>
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-[27px] w-[80px] items-center justify-center rounded-[8px]",
        "text-[16px] font-medium tracking-[-0.48px] text-white",
        status === "Actif" ? "bg-auchan-green" : "bg-text-secondary"
      )}
    >
      {status}
    </span>
  )
}

type ActionButtonProps = {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

function ActionButton({ icon, label, onClick }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group/action relative flex size-[45px] cursor-pointer items-center justify-center",
        "rounded-full text-text-secondary transition-colors",
        "hover:bg-surface-hover hover:text-text-caption"
      )}
    >
      {icon}
      <span
        className={cn(
          "pointer-events-none absolute -bottom-[14px] left-1/2 -translate-x-1/2",
          "whitespace-nowrap text-[10px] font-medium tracking-[-0.3px] text-foreground",
          "scale-90 opacity-0 transition-all duration-200 group-hover/action:scale-100 group-hover/action:opacity-100"
        )}
      >
        {label}
      </span>
    </button>
  )
}

export function CashierActions({ row }: { row: CashierRow }) {
  return (
    <div className="flex items-center gap-[1px]">
      <ActionButton icon={<EditSolidIcon />} label="Modifier" />
      <ActionButton icon={<ExchangeFilledIcon />} label="Transférer" />
      <ActionButton icon={<ListUlIcon />} label="Historique" />
      <ActionButton
        icon={<UserBlockedIcon />}
        label={row.status === "Actif" ? "Bloquer" : "Débloquer"}
      />
    </div>
  )
}
