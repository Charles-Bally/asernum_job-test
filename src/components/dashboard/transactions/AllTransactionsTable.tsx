"use client"

import { useSidebar } from "@/components/sidebar_system"
import type {
  ColumnConfig,
  QuickFilterConfig,
  TableFetchParams,
  TableFetcherResult,
  TableSchema,
} from "@/components/table_system"
import { TableKit } from "@/components/table_system"
import { EmptyState } from "@/components/ui/render/EmptyState"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { transactionsService } from "@/services/transactions/transactions.service"
import type { TransactionRow } from "@/services/transactions/transactions.types"
import { ArrowLeftRight } from "lucide-react"
import { useCallback, useMemo } from "react"

const STORE_CODES = new Set(["M0001", "M0002", "M0003", "M0004", "M0005"])

const QUICK_FILTERS: QuickFilterConfig[] = [
  {
    key: "type",
    label: "Type",
    options: [
      { label: "Tous", value: "" },
      { label: "Rendu monnaie", value: "Rendu monnaie" },
      { label: "Paiement courses", value: "Paiement course" },
    ],
  },
  {
    key: "store",
    label: "Magasin",
    options: [
      { label: "Tous", value: "" },
      { label: "Angré Djibi 1", value: "M0001" },
      { label: "Marcory Zone 4", value: "M0002" },
      { label: "Plateau Centre", value: "M0003" },
      { label: "Yopougon Selmer", value: "M0004" },
      { label: "Treichville Gare", value: "M0005" },
    ],
  },
]

function formatAmount(amount: number): string {
  const abs = Math.abs(amount).toLocaleString("fr-FR")
  return amount >= 0 ? `+${abs} FCFA` : `-${abs} FCFA`
}

export function AllTransactionsTable() {
  const sidebar = useSidebar()

  const handleRowClick = useCallback(
    (row: TransactionRow) => {
      sidebar.open({ entity: "transaction-detail", entityId: row.id })
    },
    [sidebar]
  )

  const columns: ColumnConfig<TransactionRow>[] = useMemo(
    () => [
      {
        key: "id",
        title: "ID Transaction",
        width: 1,
        minBreakpoint: 1024,
        render: (_: unknown, row: TransactionRow) => (
          <span className="text-[16px] font-medium tracking-[-0.48px] text-black">
            {row.id}
          </span>
        ),
      },
      {
        key: "type",
        title: "Type",
        width: 1.2,
        render: (_: unknown, row: TransactionRow) => (
          <span className="text-[13px] lg:text-[18px] font-bold tracking-[-0.39px] lg:tracking-[-0.54px] text-black">
            {row.type}
          </span>
        ),
      },
      {
        key: "store",
        title: "Magasin",
        width: 1,
        render: (_: unknown, row: TransactionRow) => (
          <span className="text-[13px] lg:text-[16px] font-medium tracking-[-0.39px] lg:tracking-[-0.48px] text-black">
            {row.store}
          </span>
        ),
      },
      {
        key: "amount",
        title: "Montant",
        width: 1,
        render: (_: unknown, row: TransactionRow) => (
          <span className="text-[13px] lg:text-[16px] font-medium tracking-[-0.39px] lg:tracking-[-0.48px] text-black">
            {formatAmount(row.amount)}
          </span>
        ),
      },
      {
        key: "client",
        title: "Client",
        width: 1,
        minBreakpoint: 1024,
        render: (_: unknown, row: TransactionRow) => (
          <span className="text-[16px] font-medium tracking-[-0.48px] text-black">
            {row.client ?? "N/A"}
          </span>
        ),
      },
      {
        key: "date",
        title: "Date",
        width: 0.8,
        render: (_: unknown, row: TransactionRow) => (
          <span className="text-[13px] lg:text-[16px] font-medium tracking-[-0.39px] lg:tracking-[-0.48px] text-black">
            {row.date}
          </span>
        ),
      },
    ],
    []
  )

  const fetcher = useMemo(
    () =>
      async (params: TableFetchParams): Promise<TableFetcherResult<TransactionRow>> => {
        const isStore = params.quickFilter && STORE_CODES.has(params.quickFilter)
        return transactionsService.getTransactions({
          page: params.page,
          limit: params.limit,
          ...(params.search && { search: params.search }),
          ...(isStore && { storeId: params.quickFilter }),
          ...(!isStore && params.quickFilter && { quickFilter: params.quickFilter }),
          ...(params.dateFrom && { dateFrom: params.dateFrom }),
          ...(params.dateTo && { dateTo: params.dateTo }),
        })
      },
    []
  )

  const schema: TableSchema<TransactionRow> = useMemo(
    () => ({
      key: "all-transactions",
      title: "Transactions",
      searchPlaceholder: "Type, point de vente, n° client, n° d'avoir...",
      api: {
        fetcher,
        queryKey: QUERY_KEYS.TRANSACTIONS,
        defaultLimit: 10,
      },
      columns,
      filters: { quickFilters: QUICK_FILTERS },
      actions: { rowClick: handleRowClick },
      ui: {
        showExport: true,
        exportLabel: "Exporter",
        showRefresh: true,
        showRowBorder: false,
        showDateRange: true,
        headerLayout: "single-row",
        searchWidth: "w-[308px]",
        containerClassName: "rounded-none",
        paginationVariant: "compact",
        minHeight: "400px",
        rowClassName: "h-[46px] lg:h-[58px]",
        noDataComponent: (
          <EmptyState
            title="Aucune transaction"
            message="Aucune transaction enregistrée."
            icon={<ArrowLeftRight size={40} strokeWidth={1.2} />}
          />
        ),
      },
    }),
    [columns, fetcher, handleRowClick]
  )

  return <TableKit schema={schema} />
}
