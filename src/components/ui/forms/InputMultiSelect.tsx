"use client"

import { cn } from "@/lib/utils"
import { autoUpdate, flip, FloatingPortal, offset, shift, size, useClick, useDismiss, useFloating, useInteractions } from "@floating-ui/react"
import { ChevronDown, Loader2, Search } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { DropdownOption } from "./InputDropdown"

type InputMultiSelectProps = {
  topLabel?: { text: string; required?: boolean; className?: string }
  options: DropdownOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  error?: { active: boolean; message: string }
  className?: string
  onSearch?: (query: string) => void
  onLoadMore?: () => void
  isLoading?: boolean
  hasMore?: boolean
}

function normalize(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

function InputMultiSelect({
  topLabel, options, value, onChange,
  placeholder = "Sélectionner...", disabled, error, className,
  onSearch, onLoadMore, isLoading, hasMore,
}: InputMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const isAsync = !!onSearch

  const { refs: { setReference, setFloating }, floatingStyles, context } = useFloating({
    open,
    onOpenChange: (v) => {
      setOpen(v)
      if (!v) { setSearch(""); if (isAsync) onSearch("") }
    },
    placement: "bottom",
    middleware: [
      offset(4), flip({ padding: 8 }), shift({ padding: 8 }),
      size({ apply({ rects, elements }) { Object.assign(elements.floating.style, { width: `${rects.reference.width}px` }) } }),
    ],
    whileElementsMounted: autoUpdate,
  })

  const click = useClick(context)
  const dismiss = useDismiss(context)
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 0)
  }, [open])

  const handleScroll = useCallback(() => {
    const el = listRef.current
    if (!el || !hasMore || !onLoadMore || isLoading) return
    const { scrollTop, scrollHeight, clientHeight } = el
    if (scrollHeight - scrollTop - clientHeight < 40) onLoadMore()
  }, [hasMore, onLoadMore, isLoading])

  const handleSearchChange = useCallback((val: string) => {
    setSearch(val)
    if (isAsync) {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => onSearch(val), 300)
    }
  }, [isAsync, onSearch])

  const filtered = useMemo(() => {
    if (isAsync) return options
    if (!search) return options
    const q = normalize(search)
    return options.filter((o) => normalize(o.label).includes(q))
  }, [options, search, isAsync])

  const toggleOption = useCallback((optionValue: string) => {
    const next = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue]
    onChange(next)
  }, [value, onChange])

  const displayLabel = useMemo(() => {
    if (value.length === 0) return null
    if (value.length <= 2) {
      return value.map((v) => options.find((o) => o.value === v)?.label).filter(Boolean).join(", ")
    }
    return `${value.length} sélectionnés`
  }, [value, options])

  return (
    <div className={cn("flex w-full flex-col gap-1", className)}>
      {topLabel && (
        <label className={cn("text-[16px] font-medium text-foreground", topLabel.className)}>
          {topLabel.text}
          {topLabel.required && <span className="text-auchan-red"> *</span>}
        </label>
      )}

      <button
        ref={setReference} type="button" disabled={disabled}
        {...getReferenceProps()}
        className={cn(
          "flex h-[56px] w-full items-center justify-between rounded-[12px] border border-border-input bg-white px-4 text-left transition-all duration-200",
          open && "border-auchan-red",
          disabled && "cursor-not-allowed bg-neutral-100",
          error?.active && "border-auchan-red",
        )}
      >
        <span className={cn("text-[16px] font-medium", displayLabel ? "text-foreground" : "text-text-muted")}>
          {displayLabel ?? placeholder}
        </span>
        <ChevronDown size={18} className={cn("shrink-0 text-text-caption rotate-180 transition-transform", open && "rotate-0")} />
      </button>

      {open && (
        <FloatingPortal>
          <div ref={setFloating} style={floatingStyles} {...getFloatingProps()}
            className="z-[9999] rounded-[12px] border border-border-light bg-white shadow-lg"
          >
            <div className="flex items-center gap-2 border-b border-border-light px-3 py-2">
              {isLoading
                ? <Loader2 size={16} className="shrink-0 animate-spin text-text-caption" />
                : <Search size={16} className="shrink-0 text-text-caption" />
              }
              <input
                ref={inputRef} type="text" value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Rechercher..."
                className="w-full bg-transparent text-[14px] text-foreground outline-none placeholder:text-text-muted"
              />
            </div>
            <div ref={listRef} onScroll={handleScroll} className="max-h-[180px] overflow-y-auto">
              {isLoading && filtered.length === 0 ? (
                <div className="flex items-center justify-center gap-2 py-6">
                  <Loader2 size={18} className="animate-spin text-text-caption" />
                  <span className="text-[13px] text-text-secondary">Chargement...</span>
                </div>
              ) : filtered.length === 0 ? (
                <p className="px-4 py-3 text-[14px] text-text-secondary">Aucun résultat</p>
              ) : (
                <>
                  {filtered.map((opt) => {
                    const checked = value.includes(opt.value)
                    return (
                      <button key={opt.value} type="button" onClick={() => toggleOption(opt.value)}
                        className={cn(
                          "flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-muted",
                          checked && "bg-surface-muted",
                        )}
                      >
                        <div className={cn(
                          "flex size-[18px] shrink-0 items-center justify-center rounded-[4px] border-2 transition-colors",
                          checked ? "border-auchan-red bg-auchan-red" : "border-border-input bg-white",
                        )}>
                          {checked && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className={cn("text-[15px] font-medium", checked ? "text-auchan-red" : "text-foreground")}>
                          {opt.label}
                        </span>
                      </button>
                    )
                  })}
                  {hasMore && <div className="flex justify-center py-2">
                    <Loader2 size={16} className="animate-spin text-text-caption" />
                  </div>}
                </>
              )}
            </div>
          </div>
        </FloatingPortal>
      )}

      {error?.active && <p className="mt-1 text-sm text-auchan-red">{error.message}</p>}
    </div>
  )
}

export default InputMultiSelect
