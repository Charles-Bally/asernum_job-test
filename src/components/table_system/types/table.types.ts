import type { ReactNode } from "react"

/* ─── Sort ─── */
export type SortDirection = "asc" | "desc" | null

/* ─── Column ─── */
export type ColumnConfig<T = Record<string, unknown>> = {
  key: string
  title: string
  width: number
  sortable?: boolean
  defaultHidden?: boolean
  className?: string
  render?: (value: unknown, row: T) => ReactNode
  actionContent?: (row: T, close: () => void) => ReactNode
}

/* ─── Filters ─── */
export type QuickFilterOption = {
  label: string
  value: string
  color?: string
}

export type QuickFilterConfig = {
  key: string
  label: string
  options: QuickFilterOption[]
  multiple?: boolean
}

/* ─── API / Fetching ─── */
export type TableFetchParams = {
  page: number
  limit: number
  search?: string
  sort?: { key: string; direction: SortDirection }
  filters?: Record<string, string | string[]>
  quickFilter?: string
}

export type TableRawResult<T> = {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type TableFetcherResult<T> = {
  rows: T[]
  total: number
  page: number
  totalPages: number
}

export function normalizeTableResult<T>(raw: TableRawResult<T>): TableFetcherResult<T> {
  return {
    rows: raw.data,
    total: raw.total,
    page: raw.page,
    totalPages: raw.totalPages,
  }
}

/* ─── Schema ─── */
export type TableSchema<T = Record<string, unknown>> = {
  key: string
  title: string
  searchPlaceholder?: string
  api: {
    fetcher: (params: TableFetchParams) => Promise<TableFetcherResult<T>>
    queryKey: string[]
    defaultLimit?: number
  }
  columns: ColumnConfig<T>[]
  filters?: {
    quickFilters?: QuickFilterConfig[]
  }
  actions?: {
    rowClick?: (row: T) => void
  }
  ui?: {
    noDataText?: string
    noDataComponent?: ReactNode
    showExport?: boolean
    exportLabel?: string
    onExport?: () => void
    showRefresh?: boolean
    showPagination?: boolean
    showHeader?: boolean
    customHeader?: ReactNode
    headerActions?: ReactNode
    containerClassName?: string
  }
}

/* ─── Tabs ─── */
export type TabConfig = {
  key: string
  label: string
}

export type TabsVariant = "pill" | "underline"

export type TableKitMultiTabProps = {
  tabs: TabConfig[]
  variant?: TabsVariant
  persistKey?: string
  children: (activeTab: string) => ReactNode
}
