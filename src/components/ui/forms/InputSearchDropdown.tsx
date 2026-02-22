"use client"

import { cn } from "@/lib/utils"
import { autoUpdate, flip, FloatingPortal, offset, shift, size, useClick, useDismiss, useFloating, useInteractions } from "@floating-ui/react"
import { ChevronDown, Loader2, Search } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { DropdownOption } from "./InputDropdown"

type InputSearchDropdownProps = {
  topLabel?: { text: string; required?: boolean; className?: string }
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
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

function InputSearchDropdown({
  topLabel, options, value, onChange,
  placeholder = "Sélectionner...", disabled, error, className,
  onSearch, onLoadMore, isLoading, hasMore,
}: InputSearchDropdownProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
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

  useEffect(() => {
    if (!open || !hasMore || !onLoadMore) return
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onLoadMore() },
      { root: listRef.current, threshold: 0.1 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [open, hasMore, onLoadMore, options.length])

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

  const handleSelect = useCallback((v: string) => {
    onChange(v)
    setOpen(false)
    setSearch("")
    if (isAsync) onSearch("")
  }, [onChange, isAsync, onSearch])

  const selected = options.find((o) => o.value === value)

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
        <span className={cn("text-[16px] font-medium", selected ? "text-foreground" : "text-text-muted")}>
          {selected?.label ?? placeholder}
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
            <div ref={listRef} className="max-h-[180px] overflow-y-auto">
              {isLoading && filtered.length === 0 ? (
                <div className="flex items-center justify-center gap-2 py-6">
                  <Loader2 size={18} className="animate-spin text-text-caption" />
                  <span className="text-[13px] text-text-secondary">Chargement...</span>
                </div>
              ) : filtered.length === 0 ? (
                <p className="px-4 py-3 text-[14px] text-text-secondary">Aucun résultat</p>
              ) : (
                <>
                  {filtered.map((opt) => (
                    <button key={opt.value} type="button" onClick={() => handleSelect(opt.value)}
                      className={cn(
                        "flex w-full cursor-pointer flex-col gap-0.5 px-4 py-3 text-left transition-colors hover:bg-surface-muted",
                        opt.value === value && "bg-surface-muted",
                      )}
                    >
                      <span className={cn("text-[15px] font-medium", opt.value === value ? "text-auchan-red" : "text-foreground")}>
                        {opt.label}
                      </span>
                    </button>
                  ))}
                  {hasMore && <div ref={sentinelRef} className="flex justify-center py-2">
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

export default InputSearchDropdown
