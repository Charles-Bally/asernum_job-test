"use client"

import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

type PaginationControlsProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  variant?: "default" | "compact"
}

export function PaginationControls({
  page,
  totalPages,
  onPageChange,
  variant = "default",
}: PaginationControlsProps) {
  if (totalPages <= 1) return null

  if (variant === "compact") {
    return <CompactPagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
  }

  return <DefaultPagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
}

function DefaultPagination({
  page,
  totalPages,
  onPageChange,
}: Omit<PaginationControlsProps, "variant">) {
  const pages = getVisiblePages(page, totalPages)

  return (
    <div className="flex items-center justify-center gap-2.5 lg:gap-[20px] py-5 lg:py-[30px] pt-0">
      <NavButton direction="prev" disabled={page <= 1} onClick={() => onPageChange(page - 1)} />

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="text-[16px] lg:text-[20px] font-black tracking-[-0.48px] lg:tracking-[-0.6px] text-text-muted">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={cn(
              "flex size-[38px] lg:size-[50px] cursor-pointer items-center justify-center rounded-[8px] lg:rounded-[10px] text-[16px] lg:text-[20px] font-black tracking-[-0.48px] lg:tracking-[-0.6px] transition-all duration-200",
              p === page
                ? "border-2 lg:border-3 border-auchan-red text-black"
                : "bg-border-default text-black hover:border-2 lg:hover:border-3 hover:border-auchan-red-muted hover:bg-transparent active:scale-95"
            )}
          >
            {p}
          </button>
        )
      )}

      <NavButton direction="next" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} />
    </div>
  )
}

function CompactPagination({
  page,
  totalPages,
  onPageChange,
}: Omit<PaginationControlsProps, "variant">) {
  return (
    <div className="flex items-center justify-end gap-[8px] px-[20px] py-[14px]">
      <span className="text-[13px] tracking-[-0.39px] text-text-secondary">
        {page} / {totalPages}
      </span>

      <div className="flex items-center gap-[4px]">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className={cn(
            "flex size-[28px] items-center justify-center rounded-[8px] transition-colors",
            page <= 1
              ? "cursor-not-allowed text-text-muted opacity-40"
              : "cursor-pointer text-text-caption hover:bg-surface-muted active:bg-surface-hover"
          )}
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className={cn(
            "flex size-[28px] items-center justify-center rounded-[8px] transition-colors",
            page >= totalPages
              ? "cursor-not-allowed text-text-muted opacity-40"
              : "cursor-pointer text-text-caption hover:bg-surface-muted active:bg-surface-hover"
          )}
        >
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

function NavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next"
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex size-[32px] lg:size-[40px] items-center justify-center rounded-[8px] lg:rounded-[10px] transition-all duration-200",
        disabled
          ? "cursor-not-allowed text-text-muted opacity-40"
          : "cursor-pointer text-auchan-red hover:scale-110 hover:bg-auchan-red-light active:scale-95"
      )}
    >
      {direction === "prev" ? (
        <ChevronLeft size={20} strokeWidth={3} />
      ) : (
        <ChevronRight size={20} strokeWidth={3} />
      )}
    </button>
  )
}

function getVisiblePages(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  if (current <= 3) return [1, 2, 3, 4, "...", total]
  if (current >= total - 2) return [1, "...", total - 3, total - 2, total - 1, total]
  return [1, "...", current - 1, current, current + 1, "...", total]
}
