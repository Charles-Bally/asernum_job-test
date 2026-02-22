"use client"

import { cn } from "@/lib/utils"
import { List } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

type ActionsCellProps<T> = {
  row: T
  actionContent: (row: T, close: () => void) => React.ReactNode
}

export function ActionsCell<T>({ row, actionContent }: ActionsCellProps<T>) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <div ref={containerRef} className="relative flex items-center justify-end">
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen((prev) => !prev)
        }}
        className={cn(
          "flex size-[24px] lg:size-[28px] items-center justify-center rounded-[6px] lg:rounded-[8px] transition-colors",
          open ? "bg-surface-muted" : "hover:bg-surface-muted"
        )}
      >
        <List size={16} className="text-text-caption lg:size-[18px]" />
      </button>

      {open && (
        <div className="absolute right-0 bottom-full mb-1 z-20 min-w-[150px] lg:min-w-[180px] rounded-[10px] lg:rounded-[12px] bg-white p-1 lg:p-[6px] shadow-lg ring-1 ring-border-light">
          {actionContent(row, close)}
        </div>
      )}
    </div>
  )
}
