"use client"

import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { ArrowDown, ArrowUp } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useColumnVisibility } from "../hooks/useColumnVisibility"
import { tableManagerService } from "../services/tableManager.service"
import type { SortDirection, TableFetchParams, TableSchema } from "../types/table.types"
import { PaginationControls } from "./PaginationControls"
import { TableBody } from "./TableBody"
import { TableHeader } from "./TableHeader"

type TableKitProps<T> = {
  schema: TableSchema<T>
}

export function TableKit<T extends Record<string, unknown>>({
  schema,
}: TableKitProps<T>) {
  const { api, columns, filters, actions, ui } = schema
  const limit = api.defaultLimit ?? 10

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [quickFilter, setQuickFilter] = useState<string>("")
  const [sort, setSort] = useState<{ key: string; direction: SortDirection }>({
    key: "",
    direction: null,
  })
  const [dateFrom, setDateFrom] = useState<string | undefined>()
  const [dateTo, setDateTo] = useState<string | undefined>()

  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value)
      setPage(1)
    }, 300)
  }, [])

  const handleDateRangeChange = useCallback(
    (from: string | undefined, to: string | undefined) => {
      setDateFrom(from)
      setDateTo(to)
      setPage(1)
    },
    []
  )

  const fetchParams: TableFetchParams = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch || undefined,
      sort: sort.direction ? sort : undefined,
      quickFilter: quickFilter || undefined,
      dateFrom,
      dateTo,
    }),
    [page, limit, debouncedSearch, sort, quickFilter, dateFrom, dateTo]
  )

  const { data, isLoading, refetch } = useQuery({
    queryKey: [...api.queryKey, fetchParams],
    queryFn: () => api.fetcher(fetchParams),
  })

  useEffect(() => {
    tableManagerService.register(schema.key, refetch)
    return () => tableManagerService.unregister(schema.key)
  }, [schema.key, refetch])

  const { visibleColumns, gridTemplateColumns } = useColumnVisibility<T>(columns)

  const handleSort = useCallback((key: string) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: "asc" }
      if (prev.direction === "asc") return { key, direction: "desc" }
      return { key: "", direction: null }
    })
    setPage(1)
  }, [])

  const handleQuickFilter = useCallback((key: string) => {
    setQuickFilter((prev) => (prev === key ? "" : key))
    setPage(1)
  }, [])

  const rows = data?.rows ?? []
  const totalPages = data?.totalPages ?? 1
  const showHeader = ui?.showHeader !== false
  const showPagination = ui?.showPagination !== false

  const actionColumn = useMemo(
    () => visibleColumns.find((col) => col.actionContent),
    [visibleColumns]
  )

  const emptyContent = ui?.noDataComponent ?? (
    <div className="flex h-[200px] items-center justify-center text-[14px] text-text-secondary">
      {ui?.noDataText ?? "Aucune donnée"}
    </div>
  )

  return (
    <div className={cn("rounded-[20px] bg-white", ui?.containerClassName)}>
      {ui?.customHeader
        ? ui.customHeader
        : showHeader && (
            <TableHeader
              title={schema.title}
              search={search}
              onSearchChange={handleSearchChange}
              searchPlaceholder={schema.searchPlaceholder}
              quickFilters={filters?.quickFilters}
              activeQuickFilter={quickFilter}
              onQuickFilterChange={handleQuickFilter}
              showExport={ui?.showExport}
              exportLabel={ui?.exportLabel}
              onExport={ui?.onExport}
              showRefresh={ui?.showRefresh}
              onRefresh={() => refetch()}
              headerActions={ui?.headerActions}
              layout={ui?.headerLayout}
              showDateRange={ui?.showDateRange}
              onDateRangeChange={handleDateRangeChange}
              searchWidth={ui?.searchWidth}
            />
          )}

      {/* Column headers */}
      <div
        className="grid h-[30px] items-center bg-surface-muted px-[20px]"
        style={{ gridTemplateColumns }}
      >
        {visibleColumns.map((col) => (
          <button
            key={col.key}
            onClick={() => col.sortable && handleSort(col.key)}
            disabled={!col.sortable}
            className={cn(
              "flex items-center gap-[4px] text-left text-[11px] font-medium tracking-[-0.33px] text-text-secondary",
              col.sortable && "cursor-pointer hover:text-text-caption",
              col.className
            )}
          >
            {col.title}
            {sort.key === col.key && sort.direction === "asc" && <ArrowUp size={10} />}
            {sort.key === col.key && sort.direction === "desc" && <ArrowDown size={10} />}
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={{ minHeight: ui?.minHeight }}>
        <TableBody
          rows={rows}
          visibleColumns={visibleColumns}
          gridTemplateColumns={gridTemplateColumns}
          isLoading={isLoading}
          limit={limit}
          emptyContent={emptyContent}
          onRowClick={actions?.rowClick}
          actionColumn={actionColumn}
          showRowBorder={ui?.showRowBorder !== false}
          rowClassName={ui?.rowClassName}
        />
      </div>

      {showPagination && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          variant={ui?.paginationVariant}
        />
      )}
    </div>
  )
}

export default TableKit
