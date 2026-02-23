"use client"

import { cn } from "@/lib/utils"

type InputCheckboxProps = {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

function InputCheckbox({ label, description, checked, onChange, disabled, className }: InputCheckboxProps) {
  return (
    <label
      className={cn(
        "flex items-start gap-3.5 rounded-[12px] border px-4 py-4 cursor-pointer transition-colors",
        checked ? "border-auchan-red" : "border-border-input",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <div className="mt-0.5 flex size-[18px] shrink-0 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => !disabled && onChange(e.target.checked)}
          disabled={disabled}
          className="peer sr-only"
        />
        <div
          className={cn(
            "flex size-[18px] items-center justify-center rounded-[4px] border-[1.5px] transition-colors",
            checked
              ? "border-auchan-red bg-auchan-red"
              : "border-border-input bg-white",
          )}
        >
          {checked && (
            <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
              <path
                d="M1.5 4L4.5 7L9.5 1"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-[15px] font-semibold text-foreground leading-tight">{label}</span>
        {description && (
          <span className="text-[13px] text-text-secondary leading-snug">{description}</span>
        )}
      </div>
    </label>
  )
}

export default InputCheckbox
