"use client"

import type {
  ColumnConfig,
  QuickFilterConfig,
  TableFetchParams,
  TableFetcherResult,
  TableSchema,
} from "@/components/table_system"
import { TableKit } from "@/components/table_system"
import { EmptyState } from "@/components/ui/render/EmptyState"
import { transactionsService } from "@/services/transactions/transactions.service"
import type { TransactionRow } from "@/services/transactions/transactions.types"
import { ArrowLeftRight } from "lucide-react"
import { useMemo } from "react"

type StoreTransactionsTableProps = {
  storeId: string
  onRowClick?: (transaction: TransactionRow) => void
}

function formatAmount(amount: number): string {
  const abs = Math.abs(amount).toLocaleString("fr-FR")
  return amount >= 0 ? `+${abs} FCFA` : `-${abs} FCFA`
}

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
]

export function StoreTransactionsTable({ storeId, onRowClick }: StoreTransactionsTableProps) {
  const columns: ColumnConfig<TransactionRow>[] = useMemo(
    () => [
      {
        key: "id",
        title: "ID Transaction",
        width: 1,
        render: (_: unknown, row: TransactionRow) => (
          <span className="text-[16px] font-medium tracking-[-0.48px] text-black">
            {row.id}
          </span>
        ),
      },
      {
        key: "type",
        title: "Type de transaction",
        width: 1.2,
        render: (_: unknown, row: TransactionRow) => (
          <span className="text-[18px] font-bold tracking-[-0.54px] text-black">
            {row.type}
          </span>
        ),
      },
      {
        key: "amount",
        title: "Montant",
        width: 1,
        render: (_: unknown, row: TransactionRow) => (
          <span className="text-[16px] font-medium tracking-[-0.48px] text-black">
            {formatAmount(row.amount)}
          </span>
        ),
      },
      {
        key: "client",
        title: "Client",
        width: 1.2,
        render: (_: unknown, row: TransactionRow) => (
          <span className="text-[16px] font-medium tracking-[-0.48px] text-black">
            {row.client ?? "N/A"}
          </span>
        ),
      },
      {
        key: "date",
        title: "Date",
        width: 1,
        render: (_: unknown, row: TransactionRow) => (
          <span className="text-[16px] font-medium tracking-[-0.48px] text-black">
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
        return transactionsService.getTransactions({
          page: params.page,
          limit: params.limit,
          ...(params.search && { search: params.search }),
          ...(params.quickFilter && { quickFilter: params.quickFilter }),
          ...(params.dateFrom && { dateFrom: params.dateFrom }),
          ...(params.dateTo && { dateTo: params.dateTo }),
          storeId,
        })
      },
    [storeId]
  )

  const schema: TableSchema<TransactionRow> = useMemo(
    () => ({
      key: `store-transactions-${storeId}`,
      title: "Transactions",
      searchPlaceholder: "Type, point de vente, n° client, n° d'avoir...",
      api: {
        fetcher,
        queryKey: ["store-transactions", storeId],
        defaultLimit: 10,
      },
      columns,
      filters: { quickFilters: QUICK_FILTERS },
      actions: { rowClick: onRowClick },
      ui: {
        showExport: true,
        exportLabel: "Exporter",
        showRefresh: true,
        showRowBorder: false,
        headerLayout: "single-row",
        showDateRange: true,
        searchWidth: "w-[308px]",
        containerClassName: "rounded-none",
        paginationVariant: "compact",
        minHeight: "400px",
        noDataComponent: (
          <EmptyState
            title="Aucune transaction"
            message="Aucune transaction enregistrée pour ce magasin."
            icon={<ArrowLeftRight size={40} strokeWidth={1.2} />}
          />
        ),
      },
    }),
    [columns, fetcher, storeId, onRowClick]
  )

  return <TableKit schema={schema} />
}
