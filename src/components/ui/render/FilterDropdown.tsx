
"use client"

import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

export type FilterOption = {
  label: string
  value: string
}

type FilterDropdownProps = {
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  allLabel?: string
  align?: "left" | "right"
  triggerClassName?: string
  dropdownClassName?: string
  optionClassName?: string
  chevronSize?: number
}

export function FilterDropdown({
  options,
  value,
  onChange,
  placeholder,
  allLabel,
  align = "left",
  triggerClassName,
  dropdownClassName,
  optionClassName,
  chevronSize = 13,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  const selectedOption = options.find((o) => o.value === value)
  const displayLabel = selectedOption?.label ?? placeholder ?? ""

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange(optionValue)
      setOpen(false)
    },
    [onChange]
  )

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex items-center gap-[6px] text-[12px] italic tracking-[-0.36px]",
          triggerClassName
        )}
      >
        <span className={cn(!value && placeholder && "text-text-secondary")}>
          {displayLabel}
        </span>
        <ChevronDown
          size={chevronSize}
          className={cn("shrink-0 text-text-caption transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div
          className={cn(
            "absolute top-[42px] z-50",
            align === "right" ? "right-0" : "left-0",
            dropdownClassName
          )}
        >
          {allLabel && (
            <button
              onClick={() => handleSelect("")}
              className={cn(
                "block w-full text-[12px] italic tracking-[-0.36px]",
                !value ? "font-medium text-black" : "text-text-caption",
                optionClassName
              )}
            >
              {allLabel}
            </button>
          )}
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={cn(
                "block w-full text-[12px] italic tracking-[-0.36px]",
                option.value === value
                  ? "font-medium text-black"
                  : "font-normal text-text-caption",
                optionClassName
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
