
"use client"

import CustomButton from "@/components/ui/render/CustomButton"
import { FilterDropdown } from "@/components/ui/render/FilterDropdown"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Loader2, RefreshCw, Search } from "lucide-react"
import { type ReactNode, useCallback, useState } from "react"
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
  onExport?: () => void | Promise<void>
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
    <div className={cn("relative", flexible && "flex-1 min-w-0")}>
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
        filter.options.length > 3 ? (
          <FilterDropdown
            key={filter.key}
            options={filter.options.map((opt) => ({ label: opt.label, value: opt.value }))}
            value={activeQuickFilter ?? ""}
            onChange={(val) => onQuickFilterChange?.(val)}
            allLabel={filter.label}
            triggerClassName="h-[36px] shrink-0 cursor-pointer rounded-[18px] px-[16px] bg-surface-muted text-text-secondary hover:bg-surface-hover font-medium"
            dropdownClassName="min-w-[160px] rounded-[12px] bg-white shadow-lg border border-border-light p-2"
            optionClassName="px-3 py-2 rounded-[8px] text-left cursor-pointer hover:bg-surface-muted transition-colors"
          />
        ) : (
          filter.options.map((opt) => (
            <button
              key={`${filter.key}-${opt.value}`}
              onClick={() => onQuickFilterChange?.(opt.value)}
              className={cn(
                "h-[36px] shrink-0 cursor-pointer rounded-[18px] px-[16px] text-[12px] font-medium tracking-[-0.36px] transition-colors",
                activeQuickFilter === opt.value
                  ? "bg-auchan-red-light text-foreground"
                  : "bg-surface-muted text-text-secondary hover:bg-surface-hover"
              )}
            >
              {opt.label}
            </button>
          ))
        )
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
  onExport?: () => void | Promise<void>
  headerActions?: ReactNode
}) {
  const [rotation, setRotation] = useState(0)
  const [exporting, setExporting] = useState(false)

  const handleRefresh = useCallback(() => {
    setRotation((prev) => prev + 360)
    onRefresh?.()
  }, [onRefresh])

  const handleExport = useCallback(async () => {
    if (exporting || !onExport) return
    setExporting(true)
    try {
      await onExport()
    } finally {
      setExporting(false)
    }
  }, [exporting, onExport])

  return (
    <>
      {showRefresh && (
        <CustomButton
          onClick={handleRefresh}
          className="flex size-[36px] shrink-0 items-center justify-center rounded-[18px] bg-surface-muted text-text-caption hover:bg-surface-hover"
        >
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <RefreshCw size={16} />
          </motion.div>
        </CustomButton>
      )}
      {showExport && (
        <CustomButton
          onClick={handleExport}
          disabled={exporting}
          className={cn(
            "h-[36px] lg:h-[46px] shrink-0 rounded-[8px] lg:rounded-[10px] bg-auchan-red px-4 lg:px-[24px] text-[13px] lg:text-[18px] font-bold text-white hover:bg-auchan-red-hover",
            exporting && "opacity-80 cursor-not-allowed"
          )}
        >
          {exporting ? (
            <span className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              {exportLabel}
            </span>
          ) : exportLabel}
        </CustomButton>
      )}
      {headerActions}
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
      <div className="flex flex-col gap-3 px-4 pb-4 pt-5 lg:px-[30px] lg:pb-[20px] lg:pt-[30px]">
        {/* Row 1: Title + actions (desktop inline, mobile title only) */}
        <div className="flex items-center justify-between lg:hidden">
          <h2 className="text-[20px] font-bold tracking-[-0.6px] text-foreground">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            <ActionButtons
              showRefresh={showRefresh}
              onRefresh={onRefresh}
              showExport={false}
              headerActions={undefined}
            />
          </div>
        </div>

        {/* Desktop single-row layout */}
        <div className="hidden lg:flex lg:items-center lg:gap-[10px]">
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

        {/* Mobile: Search full width */}
        <div className="lg:hidden">
          <SearchInput
            search={search}
            onSearchChange={onSearchChange}
            searchPlaceholder={searchPlaceholder}
            flexible
          />
        </div>

        {/* Mobile: Filters scrollable row */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none lg:hidden">
          <QuickFilters
            quickFilters={quickFilters}
            activeQuickFilter={activeQuickFilter}
            onQuickFilterChange={onQuickFilterChange}
          />
          {showDateRange && <DateRangePicker onChange={onDateRangeChange} />}
        </div>

        {/* Mobile: Action buttons row */}
        {(showExport || headerActions) && (
          <div className="flex items-center gap-2 lg:hidden">
            <ActionButtons
              showRefresh={false}
              showExport={showExport}
              exportLabel={exportLabel}
              onExport={onExport}
              headerActions={headerActions}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 lg:gap-[16px] px-4 lg:px-[30px] pb-4 lg:pb-[20px] pt-5 lg:pt-[30px]">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] lg:text-[28px] font-bold tracking-[-0.6px] lg:tracking-[-0.84px] text-text-caption">
          {title}
        </h2>
        <div className="flex items-center gap-2 lg:gap-[10px]">
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

      <div className="flex flex-wrap items-center gap-2 lg:gap-[10px]">
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
