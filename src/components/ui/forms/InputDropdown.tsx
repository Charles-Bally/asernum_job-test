"use client"

import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

export type DropdownOption = {
  value: string
  label: string
  description?: string
}

type InputDropdownProps = {
  topLabel?: {
    text: string
    required?: boolean
    className?: string
  }
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: {
    active: boolean
    message: string
  }
  className?: string
}

function InputDropdown({
  topLabel,
  options,
  value,
  onChange,
  placeholder = "Sélectionner...",
  disabled,
  error,
  className,
}: InputDropdownProps) {
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

  const handleSelect = useCallback(
    (optionValue: string) => {
      onChange(optionValue)
      setOpen(false)
    },
    [onChange],
  )

  const selected = options.find((o) => o.value === value)

  return (
    <div className={cn("flex w-full flex-col gap-1", className)} ref={ref}>
      {topLabel && (
        <label className={cn("text-[16px] font-medium text-foreground", topLabel.className)}>
          {topLabel.text}
          {topLabel.required && <span className="text-auchan-red"> *</span>}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          className={cn(
            "flex h-[56px] w-full items-center justify-between rounded-[12px] border border-border-input bg-white px-4 text-left transition-all duration-200",
            open && "border-auchan-red",
            disabled && "cursor-not-allowed bg-neutral-100",
            error?.active && "border-auchan-red",
          )}
        >
          <span className={cn("text-[16px] font-medium", selected ? "text-foreground" : "text-text-muted")}>
            {selected?.label ?? placeholder}
          </span>
          <ChevronDown
            size={18}
            className={cn("shrink-0 text-text-caption rotate-180 transition-transform", open && "rotate-0")}
          />
        </button>

        {open && (
          <div className="absolute bottom-full left-0 right-0 z-50 mb-1 max-h-[220px] overflow-y-auto rounded-[12px] border border-border-light bg-white shadow-lg">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  "flex w-full cursor-pointer flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-surface-muted",
                  opt.value === value && "bg-surface-muted",
                )}
              >
                <span className={cn("text-[15px] font-medium", opt.value === value ? "text-auchan-red" : "text-foreground")}>
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="text-[13px] text-text-secondary">{opt.description}</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {error?.active && (
        <p className="mt-1 text-sm text-auchan-red">{error.message}</p>
      )}
    </div>
  )
}

export default InputDropdown
