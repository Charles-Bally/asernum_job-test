
"use client"

import { cn } from "@/lib/utils"
import { PackageOpen } from "lucide-react"
import CustomButton from "./CustomButton"

type EmptyStateProps = {
  title?: string
  message?: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  title = "Aucun résultat",
  message = "Aucune donnée disponible pour le moment.",
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-[10px] lg:gap-[12px] py-10 lg:py-[60px]",
        className
      )}
    >
      <div className="text-text-secondary">
        {icon ?? <PackageOpen size={48} strokeWidth={1.2} />}
      </div>

      <div className="flex flex-col items-center gap-[4px]">
        <p className="text-[16px] lg:text-[18px] font-bold tracking-[-0.48px] lg:tracking-[-0.54px] text-text-caption">
          {title}
        </p>
        <p className="text-[13px] lg:text-[14px] tracking-[-0.39px] lg:tracking-[-0.42px] text-text-secondary text-center px-4">
          {message}
        </p>
      </div>

      {action && (
        <CustomButton
          onClick={action.onClick}
          className="mt-[8px] h-[36px] lg:h-[40px] rounded-[10px] bg-auchan-red px-4 lg:px-[20px] text-[13px] lg:text-[14px] font-bold text-white hover:bg-auchan-red-hover"
        >
          {action.label}
        </CustomButton>
      )}
    </div>
  )
}
