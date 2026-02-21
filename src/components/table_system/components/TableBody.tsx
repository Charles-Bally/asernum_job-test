"use client"

import { cn } from "@/lib/utils"
import { useCallback, useEffect, useRef, useState } from "react"
import type { ColumnConfig } from "../types/table.types"
import { ActionsCell } from "./ActionsCell"
import { RowsSkeleton } from "./RowsSkeleton"

type ContextMenuState<T> = {
  row: T
  x: number
  y: number
} | null

type TableBodyProps<T> = {
  rows: T[]
  visibleColumns: ColumnConfig<T>[]
  gridTemplateColumns: string
  isLoading: boolean
  limit: number
  emptyContent: React.ReactNode
  onRowClick?: (row: T) => void
  actionColumn?: ColumnConfig<T>
}

export function TableBody<T extends Record<string, unknown>>({
  rows,
  visibleColumns,
  gridTemplateColumns,
  isLoading,
  limit,
  emptyContent,
  onRowClick,
  actionColumn,
}: TableBodyProps<T>) {
  const [contextMenu, setContextMenu] = useState<ContextMenuState<T>>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const closeMenu = useCallback(() => setContextMenu(null), [])

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, row: T) => {
      if (!actionColumn?.actionContent) return
      e.preventDefault()
      setContextMenu({ row, x: e.clientX, y: e.clientY })
    },
    [actionColumn]
  )

  useEffect(() => {
    if (!contextMenu) return

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setContextMenu(null)
      }
    }

    function handleScroll() {
      setContextMenu(null)
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("scroll", handleScroll, true)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("scroll", handleScroll, true)
    }
  }, [contextMenu])

  if (isLoading) {
    return (
      <RowsSkeleton
        columns={visibleColumns.length}
        rows={limit}
        gridTemplateColumns={gridTemplateColumns}
      />
    )
  }

  if (rows.length === 0) return <>{emptyContent}</>

  return (
    <>
      {rows.map((row, idx) => (
        <div
          key={idx}
          onClick={() => onRowClick?.(row)}
          onContextMenu={(e) => handleContextMenu(e, row)}
          className={cn(
            "grid h-[48px] items-center border-b border-border-light px-[20px]",
            onRowClick && "cursor-pointer hover:bg-surface-hover"
          )}
          style={{ gridTemplateColumns }}
        >
          {visibleColumns.map((col) =>
            col.actionContent ? (
              <ActionsCell key={col.key} row={row} actionContent={col.actionContent} />
            ) : (
              <div
                key={col.key}
                className={cn("truncate pr-[10px] text-[14px]", col.className)}
              >
                {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
              </div>
            )
          )}
        </div>
      ))}

      {/* Context menu (clic droit) */}
      {contextMenu && actionColumn?.actionContent && (
        <div
          ref={menuRef}
          className="fixed z-50 min-w-[180px] rounded-[12px] bg-white p-[6px] shadow-lg ring-1 ring-border-light"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {actionColumn.actionContent(contextMenu.row, closeMenu)}
        </div>
      )}
    </>
  )
}
