
"use client"

import { useSidebar } from "@/components/sidebar_system"
import type { ColumnConfig, TableFetcherResult, TableSchema } from "@/components/table_system"
import { TableKit } from "@/components/table_system"
import CustomLink from "@/components/ui/render/CustomLink"
import { EmptyState } from "@/components/ui/render/EmptyState"
import { PATHNAME } from "@/constants/pathname.constant"
import { cn } from "@/lib/utils"
import { transactionsService } from "@/services/transactions/transactions.service"
import type { TransactionRow } from "@/services/transactions/transactions.types"
import { ArrowLeftRight, Eye } from "lucide-react"
import { useCallback, useMemo } from "react"

function formatAmount(amount: number): string {
  const abs = Math.abs(amount).toLocaleString("fr-FR")
  return amount >= 0 ? `+${abs} FCFA` : `-${abs} FCFA`
}

async function apiFetcher(): Promise<TableFetcherResult<TransactionRow>> {
  return transactionsService.getTransactions({ limit: 7 })
}

function PreviewHeader() {
  return (
    <div className="flex px-4 lg:px-[35px] justify-end pb-3 lg:pb-[20px]">
      <CustomLink
        href={PATHNAME.DASHBOARD.transactions}
        variant="none"
        size="none"
        animation={true}
        className="shrink-0 whitespace-nowrap rounded-[8px] lg:rounded-[10px] h-auto lg:h-[40px] border-[1.5px] lg:border-3 border-auchan-red px-2.5 lg:px-[14px] py-[5px] lg:py-[9px] text-[12px] lg:text-[18px] font-bold tracking-[-0.36px] lg:tracking-[-0.54px] text-auchan-red"
      >
        {`Toutes les transactions >`}
      </CustomLink>
    </div>
  )
}

export function TransactionsPreview() {
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
        key: "type",
        title: "Type de transaction",
        width: 1.4,
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
          <span className="text-[12px] lg:text-[16px] font-medium tracking-[-0.36px] lg:tracking-[-0.48px] text-black">
            {row.store}
          </span>
        ),
      },
      {
        key: "amount",
        title: "Montant",
        width: 1,
        render: (_: unknown, row: TransactionRow) => (
          <span
            className={cn(
              "text-[12px] lg:text-[16px] font-medium tracking-[-0.36px] lg:tracking-[-0.48px]",
              row.amount >= 0 ? "text-auchan-green" : "text-auchan-red"
            )}
          >
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
        width: 1,
        minBreakpoint: 1024,
        render: (_: unknown, row: TransactionRow) => (
          <span className="text-[16px] font-medium tracking-[-0.48px] text-black">{row.date}</span>
        ),
      },
      {
        key: "actions",
        title: "",
        width: 0.3,
        className: "flex items-center justify-end",
        actionContent: (row: TransactionRow, close: () => void) => (
          <button
            onClick={() => {
              sidebar.open({ entity: "transaction-detail", entityId: row.id })
              close()
            }}
            className="flex w-full items-center gap-[6px] lg:gap-[8px] rounded-[6px] lg:rounded-[8px] px-2.5 lg:px-[12px] py-[6px] lg:py-[8px] text-[12px] lg:text-[13px] font-medium text-text-caption hover:bg-surface-muted"
          >
            <Eye size={14} />
            Voir les détails
          </button>
        ),
      },
    ],
    [sidebar]
  )

  const schema: TableSchema<TransactionRow> = useMemo(
    () => ({
      key: "transactions-preview",
      title: "Transactions",
      api: {
        fetcher: apiFetcher,
        queryKey: ["transactions-preview"],
        defaultLimit: 7,
      },
      actions: {
        rowClick: handleRowClick,
      },
      columns,
      ui: {
        showHeader: false,
        showPagination: false,
        customHeader: <PreviewHeader />,
        containerClassName: "flex-1 overflow-hidden rounded-[20px] lg:rounded-[40px] pt-4 lg:pt-[30px]",
        noDataComponent: (
          <EmptyState
            title="Aucune transaction"
            message="Aucune transaction enregistrée pour le moment."
            icon={<ArrowLeftRight size={40} strokeWidth={1.2} />}
          />
        ),
      },
    }),
    [columns, handleRowClick]
  )

  return <TableKit schema={schema} />
}
