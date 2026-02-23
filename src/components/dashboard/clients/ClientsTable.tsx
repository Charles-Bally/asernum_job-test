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
import { ENDPOINTS } from "@/constants/endpoints.constant"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { downloadCsv } from "@/services/export.service"
import { clientsService } from "@/services/clients/clients.service"
import type { Client } from "@/types/client.types"
import { Users } from "lucide-react"
import { useCallback, useMemo } from "react"
import { ClientStatusBadge } from "./cells/ClientStatusBadge"

const QUICK_FILTERS: QuickFilterConfig[] = [
  {
    key: "status",
    label: "Statut",
    options: [
      { label: "Tous", value: "" },
      { label: "Actif", value: "active" },
      { label: "Inactif", value: "inactive" },
    ],
  },
]

export function ClientsTable() {
  const sidebar = useSidebar()

  const handleRowClick = useCallback(
    (row: Client) => {
      sidebar.open({ entity: "client-detail", entityId: row.id })
    },
    [sidebar]
  )

  const columns: ColumnConfig<Client>[] = useMemo(
    () => [
      {
        key: "phone",
        title: "Téléphone",
        width: 1,
        render: (_: unknown, row: Client) => (
          <span className="text-[13px] lg:text-[16px] font-bold tracking-[-0.39px] lg:tracking-[-0.48px] text-black">
            {row.phone}
          </span>
        ),
      },
      {
        key: "firstName",
        title: "Nom",
        width: 1.2,
        render: (_: unknown, row: Client) => (
          <span className="text-[14px] lg:text-[18px] font-bold tracking-[-0.42px] lg:tracking-[-0.54px] text-black">
            {row.firstName} {row.lastName}
          </span>
        ),
      },
      {
        key: "store",
        title: "Magasin",
        width: 1,
        minBreakpoint: 1024,
        render: (_: unknown, row: Client) => (
          <span className="text-[16px] font-medium tracking-[-0.48px] text-foreground">
            {row.store}
          </span>
        ),
      },
      {
        key: "transactionCount",
        title: "Transactions",
        width: 0.8,
        minBreakpoint: 1024,
        render: (_: unknown, row: Client) => (
          <span className="text-[16px] font-medium tracking-[-0.48px] text-foreground">
            {row.transactionCount}
          </span>
        ),
      },
      {
        key: "lastVisit",
        title: "Dernière visite",
        width: 1,
        render: (_: unknown, row: Client) => (
          <span className="text-[13px] lg:text-[16px] font-medium tracking-[-0.39px] lg:tracking-[-0.48px] text-black">
            {row.lastVisit}
          </span>
        ),
      },
      {
        key: "status",
        title: "Statut",
        width: 0.6,
        render: (_: unknown, row: Client) => <ClientStatusBadge status={row.status} />,
      },
    ],
    []
  )

  const fetcher = useMemo(
    () =>
      async (params: TableFetchParams): Promise<TableFetcherResult<Client>> => {
        return clientsService.getClients({
          page: params.page,
          limit: params.limit,
          ...(params.search && { search: params.search }),
          ...(params.quickFilter && { status: params.quickFilter }),
        })
      },
    []
  )

  const schema: TableSchema<Client> = useMemo(
    () => ({
      key: "clients",
      title: "Clients",
      searchPlaceholder: "Rechercher un client...",
      api: {
        fetcher,
        queryKey: QUERY_KEYS.CLIENTS,
        defaultLimit: 10,
      },
      columns,
      filters: { quickFilters: QUICK_FILTERS },
      actions: { rowClick: handleRowClick },
      ui: {
        showExport: true,
        exportLabel: "Exporter",
        onExport: (params) => {
          downloadCsv(ENDPOINTS.CLIENTS_EXPORT, {
            search: params.search,
            ...(params.quickFilter && { status: params.quickFilter }),
          }, "clients.csv")
        },
        showRefresh: true,
        showRowBorder: false,
        headerLayout: "single-row",
        searchWidth: "w-[308px]",
        containerClassName: "rounded-none",
        paginationVariant: "compact",
        minHeight: "400px",
        rowClassName: "h-[46px] lg:h-[58px]",
        noDataComponent: (
          <EmptyState
            title="Aucun client"
            message="Aucun client trouvé."
            icon={<Users size={40} strokeWidth={1.2} />}
          />
        ),
      },
    }),
    [columns, fetcher, handleRowClick]
  )

  return <TableKit schema={schema} />
}
