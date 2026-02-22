"use client"

import CustomButton from "@/components/ui/render/CustomButton"
import { cn } from "@/lib/utils"
import { RefreshCw, Search } from "lucide-react"
import type { ReactNode } from "react"
import type { QuickFilterConfig } from "../types/table.types"
import { DateRangePicker } from "./DateRangePicker"

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
  layout?: "default" | "single-row"
  showDateRange?: boolean
  onDateRangeChange?: (from: string | undefined, to: string | undefined) => void
  searchWidth?: string
}

function SearchInput({
  search,
  onSearchChange,
  searchPlaceholder,
  width,
  flexible,
}: {
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder: string
  width?: string
  flexible?: boolean
}) {
  return (
    <div className={cn("relative", flexible && "flex-1")}>
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
          "h-[36px] rounded-[18px] bg-surface-muted pl-[36px] pr-[14px]",
          "text-[12px] italic tracking-[-0.36px] text-text-caption",
          "placeholder:text-text-secondary focus:outline-none",
          flexible ? "w-full" : (width ?? "w-[220px]")
        )}
      />
    </div>
  )
}

function QuickFilters({
  quickFilters,
  activeQuickFilter,
  onQuickFilterChange,
}: {
  quickFilters?: QuickFilterConfig[]
  activeQuickFilter?: string
  onQuickFilterChange?: (key: string) => void
}) {
  return (
    <>
      {quickFilters?.map((filter) =>
        filter.options.map((opt) => (
          <button
            key={`${filter.key}-${opt.value}`}
            onClick={() => onQuickFilterChange?.(opt.value)}
            className={cn(
              "h-[36px] cursor-pointer rounded-[18px] px-[16px] text-[12px] font-medium tracking-[-0.36px] transition-colors",
              activeQuickFilter === opt.value
                ? "bg-auchan-red-light text-foreground"
                : "bg-surface-muted text-text-secondary hover:bg-surface-hover"
            )}
          >
            {opt.label}
          </button>
        ))
      )}
    </>
  )
}

function ActionButtons({
  showRefresh,
  onRefresh,
  showExport,
  exportLabel,
  onExport,
  headerActions,
}: {
  showRefresh?: boolean
  onRefresh?: () => void
  showExport?: boolean
  exportLabel?: string
  onExport?: () => void
  headerActions?: ReactNode
}) {
  return (
    <>
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
          className="h-[46px] rounded-[10px] bg-auchan-red px-[24px] text-[18px] font-bold text-white hover:bg-auchan-red-hover"
        >
          {exportLabel}
        </CustomButton>
      )}
    </>
  )
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
  layout = "default",
  showDateRange = false,
  onDateRangeChange,
  searchWidth,
}: TableHeaderProps) {
  if (layout === "single-row") {
    return (
      <div className="flex items-center gap-[10px] px-[30px] pb-[20px] pt-[30px]">
        <h2 className="shrink-0 text-[28px] font-bold tracking-[-0.84px] text-foreground mr-8">
          {title}
        </h2>
        <div className="flex flex-1 items-center gap-[10px]">
          <SearchInput
            search={search}
            onSearchChange={onSearchChange}
            searchPlaceholder={searchPlaceholder}
            width={searchWidth}
            flexible
          />
          <QuickFilters
            quickFilters={quickFilters}
            activeQuickFilter={activeQuickFilter}
            onQuickFilterChange={onQuickFilterChange}
          />
          {showDateRange && <DateRangePicker onChange={onDateRangeChange} />}
          <ActionButtons
            showRefresh={showRefresh}
            onRefresh={onRefresh}
            showExport={showExport}
            exportLabel={exportLabel}
            onExport={onExport}
            headerActions={headerActions}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[16px] px-[30px] pb-[20px] pt-[30px]">
      <div className="flex items-center justify-between">
        <h2 className="text-[28px] font-bold tracking-[-0.84px] text-text-caption">
          {title}
        </h2>
        <div className="flex items-center gap-[10px]">
          <ActionButtons
            showRefresh={showRefresh}
            onRefresh={onRefresh}
            showExport={showExport}
            exportLabel={exportLabel}
            onExport={onExport}
            headerActions={headerActions}
          />
        </div>
      </div>

      <div className="flex items-center gap-[10px]">
        <SearchInput
          search={search}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
          width={searchWidth}
        />
        <QuickFilters
          quickFilters={quickFilters}
          activeQuickFilter={activeQuickFilter}
          onQuickFilterChange={onQuickFilterChange}
        />
        {showDateRange && <DateRangePicker onChange={onDateRangeChange} />}
      </div>
    </div>
  )
}
