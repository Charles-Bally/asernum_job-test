"use client"

import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

type PaginationControlsProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function PaginationControls({ page, totalPages, onPageChange }: PaginationControlsProps) {
  if (totalPages <= 1) return null

  const pages = getVisiblePages(page, totalPages)

  return (
    <div className="flex items-center justify-center gap-[20px] pt-0 py-[30px]">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className={cn(
          "flex size-[40px] items-center justify-center rounded-[10px] transition-all duration-200",
          page <= 1
            ? "cursor-not-allowed text-text-muted opacity-40"
            : "cursor-pointer text-auchan-red hover:scale-110 hover:bg-auchan-red-light active:scale-95"
        )}
      >
        <ChevronLeft size={20} strokeWidth={3} />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="text-[20px] font-black tracking-[-0.6px] text-text-muted">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={cn(
              "flex size-[50px] cursor-pointer items-center justify-center rounded-[10px] text-[20px] font-black tracking-[-0.6px] transition-all duration-200",
              p === page
                ? "border-3 border-auchan-red text-black"
                : "bg-border-default text-black hover:border-3 hover:border-auchan-red-muted hover:bg-transparent active:scale-95"
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className={cn(
          "flex size-[40px] items-center justify-center rounded-[10px] transition-all duration-200",
          page >= totalPages
            ? "cursor-not-allowed text-text-muted opacity-40"
            : "cursor-pointer text-auchan-red hover:scale-110 hover:bg-auchan-red-light active:scale-95"
        )}
      >
        <ChevronRight size={20} strokeWidth={3} />
      </button>
    </div>
  )
}

function getVisiblePages(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  if (current <= 3) return [1, 2, 3, 4, "...", total]
  if (current >= total - 2) return [1, "...", total - 3, total - 2, total - 1, total]
  return [1, "...", current - 1, current, current + 1, "...", total]
}
