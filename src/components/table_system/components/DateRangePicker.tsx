
"use client"

import { useMediaQuery } from "@/hooks/useMediaQuery"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { AnimatePresence, motion, type PanInfo } from "framer-motion"
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

const DAY_PICKER_CLASSES = {
  root: "text-[13px]",
  month_caption: "flex justify-center pb-[20px] text-[14px] font-bold text-foreground",
  nav: "flex items-center justify-between",
  button_previous: "absolute left-[6px] top-[6px] size-[28px] cursor-pointer rounded-full p-[4px]",
  button_next: "absolute right-[6px] top-[6px] size-[28px] cursor-pointer rounded-full p-[4px]",
  weekdays: "flex",
  weekday: "w-[36px] text-center text-[11px] font-medium text-text-secondary",
  week: "flex",
  day: "size-[36px] text-center",
  day_button: "size-full cursor-pointer rounded-full text-[13px] hover:bg-surface-muted",
  selected: "!bg-auchan-red rounded-full",
  range_start: "!bg-auchan-red !text-white font-bold rounded-full",
  range_end: "!bg-auchan-red !text-white font-bold rounded-full",
  range_middle: "!bg-auchan-red-light !text-text-caption",
  today: "font-bold text-auchan-red",
  outside: "text-text-muted",
  disabled: "text-text-muted opacity-50",
}

const MOBILE_CLASSES = {
  ...DAY_PICKER_CLASSES,
  weekday: "w-[44px] text-center text-[12px] font-medium text-text-secondary",
  day: "size-[44px] text-center",
  day_button: "size-full cursor-pointer rounded-full text-[14px] hover:bg-surface-muted",
  month_caption: "flex justify-center pb-[16px] text-[16px] font-bold text-foreground",
}

function ActionButtons({
  hasRange,
  onClear,
  onApply,
}: {
  hasRange: boolean
  onClear: () => void
  onApply: () => void
}) {
  return (
    <div className="flex items-center justify-end gap-[8px] border-t border-border-light pt-[10px]">
      <button
        type="button"
        onClick={onClear}
        className="h-[32px] cursor-pointer rounded-[8px] px-[14px] text-[12px] font-medium text-text-secondary hover:bg-surface-muted"
      >
        Effacer
      </button>
      <button
        type="button"
        onClick={onApply}
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
  )
}

const DRAG_THRESHOLD = 80
const sheetTransition = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }

export function DateRangePicker({ onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState<DateRange | undefined>()
  const containerRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

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

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open || !isDesktop) return
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open, isDesktop])

  useEffect(() => {
    if (open && !isDesktop) {
      document.body.style.overflow = "hidden"
    }
    return () => { document.body.style.overflow = "" }
  }, [open, isDesktop])

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (info.offset.y > DRAG_THRESHOLD || info.velocity.y > 500) close()
    },
    [close]
  )

  const displayText = formatRange(range)
  const hasRange = !!range?.from && !!range?.to

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
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

      {/* Desktop: dropdown */}
      {open && isDesktop && (
        <div className="absolute right-0 top-[42px] z-50 flex flex-col rounded-[16px] bg-white p-[12px] shadow-lg ring-1 ring-border-light">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            locale={fr}
            numberOfMonths={2}
            classNames={{ ...DAY_PICKER_CLASSES, months: "flex gap-[16px]" }}
          />
          <ActionButtons hasRange={hasRange} onClear={handleClear} onApply={handleApply} />
        </div>
      )}

      {/* Mobile: bottom sheet */}
      <AnimatePresence>
        {open && !isDesktop && (
          <motion.div
            key="date-sheet"
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-50"
          >
            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              transition={sheetTransition}
              className="absolute inset-0 bg-black/10"
              onClick={close}
            />
            <motion.div
              variants={{ hidden: { y: "100%" }, visible: { y: 0 } }}
              transition={sheetTransition}
              drag="y"
              dragDirectionLock
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.4 }}
              onDragEnd={handleDragEnd}
              className="absolute inset-x-0 bottom-0 flex flex-col rounded-t-[24px] bg-white px-5 pb-8 shadow-xl"
            >
              {/* Drag handle */}
              <div className="flex shrink-0 cursor-grab justify-center pt-3 pb-2 active:cursor-grabbing">
                <div className="h-[5px] w-[48px] rounded-full bg-border-light" />
              </div>

              <p className="text-[16px] font-bold tracking-[-0.48px] text-foreground mb-3">
                Sélectionner une période
              </p>

              <div className="flex justify-center">
                <DayPicker
                  mode="range"
                  selected={range}
                  onSelect={handleSelect}
                  locale={fr}
                  numberOfMonths={1}
                  classNames={MOBILE_CLASSES}
                />
              </div>

              <div className="mt-3">
                <ActionButtons hasRange={hasRange} onClear={handleClear} onApply={handleApply} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
