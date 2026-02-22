"use client"

import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { DayPicker, type DateRange } from "react-day-picker"

type DateRangePickerProps = {
  onChange?: (from: string | undefined, to: string | undefined) => void
}

function formatRange(range?: DateRange): string {
  if (!range?.from) return ""
  const from = format(range.from, "dd/MM/yyyy")
  const to = range.to ? format(range.to, "dd/MM/yyyy") : from
  return `${from} - ${to}`
}

function toApiDate(d: Date): string {
  return format(d, "dd/MM/yyyy")
}

export function DateRangePicker({ onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState<DateRange | undefined>()
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSelect = useCallback((selected: DateRange | undefined) => {
    setRange(selected)
  }, [])

  const handleApply = useCallback(() => {
    if (range?.from && range?.to) {
      onChange?.(toApiDate(range.from), toApiDate(range.to))
      setOpen(false)
    }
  }, [range, onChange])

  const handleClear = useCallback(() => {
    setRange(undefined)
    onChange?.(undefined, undefined)
    setOpen(false)
  }, [onChange])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  const displayText = formatRange(range)
  const hasRange = !!range?.from && !!range?.to

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "flex h-[36px] w-[180px] cursor-pointer items-center rounded-[18px] pl-[14px] pr-[36px]",
          "text-[12px] italic tracking-[-0.36px]",
          hasRange
            ? "bg-auchan-red-light text-foreground"
            : "bg-surface-muted text-text-secondary"
        )}
      >
        {displayText || "Debut - Fin"}
      </button>

      {hasRange ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-[10px] top-1/2 -translate-y-1/2 cursor-pointer text-text-secondary hover:text-foreground"
        >
          <X size={12} />
        </button>
      ) : (
        <Calendar
          size={14}
          className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 text-text-secondary"
        />
      )}

      {open && (
        <div className="absolute right-0 top-[42px] z-50 flex flex-col rounded-[16px] bg-white p-[12px] shadow-lg ring-1 ring-border-light">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            locale={fr}
            numberOfMonths={2}
            classNames={{
              root: "text-[13px]",
              months: "flex gap-[16px]",
              month_caption:
                "flex justify-center pb-[20px] text-[14px] font-bold text-foreground",
              nav: "flex items-center justify-between",
              button_previous:
                "absolute left-[6px] top-[6px] size-[28px] cursor-pointer rounded-full p-[4px]",
              button_next:
                "absolute right-[6px] top-[6px] size-[28px] cursor-pointer rounded-full p-[4px]",
              weekdays: "flex",
              weekday:
                "w-[36px] text-center text-[11px] font-medium text-text-secondary",
              week: "flex",
              day: "size-[36px] text-center",
              day_button:
                "size-full cursor-pointer rounded-full text-[13px] hover:bg-surface-muted",
              selected: "!bg-auchan-red rounded-full",
              range_start: "!bg-auchan-red !text-white font-bold rounded-full",
              range_end: "!bg-auchan-red !text-white font-bold rounded-full",
              range_middle: "!bg-auchan-red-light !text-text-caption",
              today: "font-bold text-auchan-red",
              outside: "text-text-muted",
              disabled: "text-text-muted opacity-50",
            }}
          />
          <div className="flex items-center justify-end gap-[8px] border-t border-border-light pt-[10px]">
            <button
              type="button"
              onClick={handleClear}
              className="h-[32px] cursor-pointer rounded-[8px] px-[14px] text-[12px] font-medium text-text-secondary hover:bg-surface-muted"
            >
              Effacer
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!hasRange}
              className={cn(
                "h-[32px] cursor-pointer rounded-[8px] px-[14px] text-[12px] font-bold",
                hasRange
                  ? "bg-auchan-red text-white hover:bg-auchan-red-hover"
                  : "bg-surface-muted text-text-muted"
              )}
            >
              Appliquer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
