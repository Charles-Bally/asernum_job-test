"use client"

import type {
  ColumnConfig,
  QuickFilterConfig,
  TableFetchParams,
  TableFetcherResult,
  TableSchema,
} from "@/components/table_system"
import { TableKit } from "@/components/table_system"
import CustomButton from "@/components/ui/render/CustomButton"
import { EmptyState } from "@/components/ui/render/EmptyState"
import { cashiersService } from "@/services/cashiers/cashiers.service"
import type { CashierRow } from "@/services/cashiers/cashiers.types"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { Users } from "lucide-react"
import { useMemo } from "react"
import { AccessKeyCell, CashierActions, StatusBadge } from "./CashierCells"

type StoreCashiersTableProps = {
  storeId: string
  onRowClick?: (cashier: CashierRow) => void
}

const QUICK_FILTERS: QuickFilterConfig[] = [
  {
    key: "status",
    label: "Statut",
    options: [
      { label: "Tous", value: "" },
      { label: "Actif", value: "Actif" },
      { label: "Bloqué", value: "Bloqué" },
    ],
  },
]

export function StoreCashiersTable({ storeId, onRowClick }: StoreCashiersTableProps) {
  const columns: ColumnConfig<CashierRow>[] = useMemo(
    () => [
      {
        key: "username",
        title: "Utilisateur",
        width: 1.5,
        render: (_: unknown, row: CashierRow) => (
          <span className="text-[14px] lg:text-[18px] font-bold tracking-[-0.42px] lg:tracking-[-0.54px] text-foreground">
            {row.username}
          </span>
        ),
      },
      {
        key: "accessKey",
        title: "Clé d\u2019accès",
        width: 1.0,
        render: (_: unknown, row: CashierRow) => <AccessKeyCell row={row} />,
      },
      {
        key: "assignedDate",
        title: "Date d\u2019affectation",
        width: 1.1,
        render: (_: unknown, row: CashierRow) => (
          <span className="text-[13px] lg:text-[16px] font-medium tracking-[-0.39px] lg:tracking-[-0.48px] text-foreground">
            {row.assignedDate}
          </span>
        ),
      },
      {
        key: "status",
        title: "Statut",
        width: 0.7,
        render: (_: unknown, row: CashierRow) => <StatusBadge status={row.status} />,
      },
      {
        key: "actions",
        title: "Actions",
        width: 1.1,
        overflow: true,
        render: (_: unknown, row: CashierRow) => <CashierActions row={row} />,
      },
    ],
    []
  )

  const fetcher = useMemo(
    () =>
      async (params: TableFetchParams): Promise<TableFetcherResult<CashierRow>> => {
        return cashiersService.getCashiers({
          page: params.page,
          limit: params.limit,
          ...(params.search && { search: params.search }),
          ...(params.quickFilter && { quickFilter: params.quickFilter }),
          storeId,
        })
      },
    [storeId]
  )

  const schema: TableSchema<CashierRow> = useMemo(
    () => ({
      key: `store-cashiers-${storeId}`,
      title: "Caissiers",
      searchPlaceholder: "Type, point de vente, n\u00B0 client, n\u00B0 d\u2019avoir...",
      api: {
        fetcher,
        queryKey: [...QUERY_KEYS.CASHIERS, storeId],
        defaultLimit: 10,
      },
      columns,
      filters: { quickFilters: QUICK_FILTERS },
      actions: { rowClick: onRowClick },
      ui: {
        showRefresh: true,
        headerLayout: "single-row",
        showDateRange: true,
        containerClassName: "rounded-none",
        paginationVariant: "compact",
        showRowBorder: false,
        minHeight: "400px",
        scrollMinWidth: "700px",
        rowClassName: "h-[50px] lg:h-[65px]",
        headerActions: (
          <CustomButton
            variant="primary"
            size="md"
            onClick={() => { }}
            className="h-[36px] lg:h-[46px] shrink-0 rounded-[8px] lg:rounded-[10px] px-4 lg:px-[40px] text-[13px] lg:text-[18px] font-bold"
          >
            Ajouter un caissier
          </CustomButton>
        ),
        noDataComponent: (
          <EmptyState
            title="Aucun caissier"
            message="Aucun caissier affecté à ce magasin."
            icon={<Users size={40} strokeWidth={1.2} />}
          />
        ),
      },
    }),
    [columns, fetcher, storeId, onRowClick]
  )

  return <TableKit schema={schema} />
}
