"use client"

import CustomButton from "@/components/ui/render/CustomButton"
import { cn } from "@/lib/utils"
import { RefreshCw, Search } from "lucide-react"
import type { ReactNode } from "react"
import type { QuickFilterConfig } from "../types/table.types"

type TableHeaderProps = {
  title: string
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  quickFilters?: QuickFilterConfig[]
  activeQuickFilter?: string
  onQuickFilterChange?: (key: string) => void
  showExport?: boolean
  exportLabel?: string
  onExport?: () => void
  showRefresh?: boolean
  onRefresh?: () => void
  headerActions?: ReactNode
}

export function TableHeader({
  title,
  search,
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  quickFilters,
  activeQuickFilter,
  onQuickFilterChange,
  showExport = false,
  exportLabel = "Exporter",
  onExport,
  showRefresh = false,
  onRefresh,
  headerActions,
}: TableHeaderProps) {
  return (
    <div className="flex flex-col gap-[16px] px-[30px] pb-[20px] pt-[30px]">
      {/* Row 1: Title + Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-[28px] font-bold tracking-[-0.84px] text-text-caption">
          {title}
        </h2>
        <div className="flex items-center gap-[10px]">
          {headerActions}
          {showRefresh && (
            <CustomButton
              onClick={() => onRefresh?.()}
              className="flex size-[36px] items-center justify-center rounded-[18px] bg-surface-muted text-text-caption hover:bg-surface-hover"
            >
              <RefreshCw size={16} />
            </CustomButton>
          )}
          {showExport && (
            <CustomButton
              onClick={() => onExport?.()}
              className="h-[46px] rounded-[20px] bg-auchan-red px-[24px] text-[14px] font-bold text-white hover:bg-auchan-red-hover"
            >
              {exportLabel}
            </CustomButton>
          )}
        </div>
      </div>

      {/* Row 2: Search + Quick filters */}
      <div className="flex items-center gap-[10px]">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-[14px] top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className={cn(
              "h-[36px] w-[220px] rounded-[18px] bg-surface-muted pl-[36px] pr-[14px]",
              "text-[12px] italic tracking-[-0.36px] text-text-caption",
              "placeholder:text-text-secondary focus:outline-none"
            )}
          />
        </div>

        {quickFilters?.map((filter) =>
          filter.options.map((opt) => (
            <button
              key={`${filter.key}-${opt.value}`}
              onClick={() => onQuickFilterChange?.(opt.value)}
              className={cn(
                "h-[36px] rounded-[18px] px-[16px] text-[12px] font-medium tracking-[-0.36px] transition-colors",
                activeQuickFilter === opt.value
                  ? "bg-auchan-red text-white"
                  : "bg-surface-muted text-text-caption hover:bg-surface-hover"
              )}
            >
              {opt.label}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
