import { useCallback, useEffect, useMemo, useState } from "react"
import type { ColumnConfig } from "../types/table.types"

type UseColumnVisibilityReturn<T> = {
  visibleColumns: ColumnConfig<T>[]
  isVisible: (key: string) => boolean
  toggleColumn: (key: string) => void
  setVisibility: (key: string, visible: boolean) => void
  gridTemplateColumns: string
}

export function useColumnVisibility<T>(
  columns: ColumnConfig<T>[]
): UseColumnVisibilityReturn<T> {
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    columns.forEach((col) => {
      if (col.defaultHidden) initial.add(col.key)
    })
    return initial
  })

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  )

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const visibleColumns = useMemo(
    () =>
      columns.filter((col) => {
        if (hiddenKeys.has(col.key)) return false
        if (col.minBreakpoint && windowWidth < col.minBreakpoint) return false
        return true
      }),
    [columns, hiddenKeys, windowWidth]
  )

  const gridTemplateColumns = useMemo(
    () => visibleColumns.map((col) => `${col.width}fr`).join(" "),
    [visibleColumns]
  )

  const isVisible = useCallback(
    (key: string) => !hiddenKeys.has(key),
    [hiddenKeys]
  )

  const toggleColumn = useCallback((key: string) => {
    setHiddenKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const setVisibility = useCallback((key: string, visible: boolean) => {
    setHiddenKeys((prev) => {
      const next = new Set(prev)
      if (visible) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  return { visibleColumns, isVisible, toggleColumn, setVisibility, gridTemplateColumns }
}
