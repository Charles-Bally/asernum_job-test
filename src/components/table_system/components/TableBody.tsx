"use client"

import { useSidebarStore } from "@/components/sidebar_system/store/useSidebar.store"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
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
  showRowBorder?: boolean
  rowClassName?: string
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
}

const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
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
  showRowBorder = true,
  rowClassName,
}: TableBodyProps<T>) {
  const sidebarEntityId = useSidebarStore((s) => (s.isOpen ? s.config?.entityId : null))
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

  const handleRowClick = useCallback(
    (e: React.MouseEvent, row: T) => {
      if (!onRowClick) return
      const target = e.target as HTMLElement
      if (target.closest("button, a, input, select, textarea, [role='button']")) return
      onRowClick(row)
    },
    [onRowClick]
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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={rows.map((r, i) => `${(r as Record<string, unknown>).id ?? i}`).join("-")}
      >
        {rows.map((row, idx) => {
          const rowId = String(row.id ?? idx)
          const isActive = sidebarEntityId !== null && rowId === sidebarEntityId

          return (
          <motion.div
            key={idx}
            variants={rowVariants}
            onClick={(e) => handleRowClick(e, row)}
            onContextMenu={(e) => handleContextMenu(e, row)}
            className={cn(
              "grid h-[42px] lg:h-[48px] items-center px-3 lg:px-[20px]",
              showRowBorder && "border-b border-border-light",
              onRowClick && "cursor-pointer group/row hover:[&:not(:has(button:hover,a:hover,[role=button]:hover))]:bg-surface-hover",
              isActive && "bg-auchan-red-light/50",
              rowClassName
            )}
            style={{ gridTemplateColumns }}
          >
            {visibleColumns.map((col) =>
              col.actionContent ? (
                <ActionsCell key={col.key} row={row} actionContent={col.actionContent} />
              ) : (
                <div
                  key={col.key}
                  className={cn(
                    "pr-[10px] text-[14px]",
                    col.overflow ? "overflow-visible" : "truncate",
                    col.className
                  )}
                >
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
                </div>
              )
            )}
          </motion.div>
          )
        })}
      </motion.div>

      {contextMenu && actionColumn?.actionContent && (
        <div
          ref={menuRef}
          className="fixed z-50 min-w-[150px] lg:min-w-[180px] rounded-[10px] lg:rounded-[12px] bg-white p-1 lg:p-[6px] shadow-lg ring-1 ring-border-light"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          {actionColumn.actionContent(contextMenu.row, closeMenu)}
        </div>
      )}
    </>
  )
}
