"use client"

import type { ColumnConfig, QuickFilterConfig, TableFetchParams, TableFetcherResult, TableSchema } from "@/components/table_system"
import { TableKit } from "@/components/table_system"
import { EmptyState } from "@/components/ui/render/EmptyState"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { accountEventsService } from "@/services/account-events/account-events.service"
import type { AccountEvent } from "@/types/account-event.types"
import { History } from "lucide-react"
import { useMemo } from "react"
import { EventActionLabel } from "../cells/EventActionLabel"

const ACTION_FILTERS: QuickFilterConfig[] = [
  {
    key: "action",
    label: "Action",
    options: [
      { label: "Toutes", value: "" },
      { label: "Création", value: "CREATED" },
      { label: "Blocage", value: "BLOCKED" },
      { label: "Déblocage", value: "UNBLOCKED" },
      { label: "Reset MDP", value: "PASSWORD_RESET" },
      { label: "Rôle modifié", value: "ROLE_CHANGED" },
      { label: "Affectation", value: "ASSIGNED_STORE" },
    ],
  },
]

export function EventsHistoryTab() {
  const columns: ColumnConfig<AccountEvent>[] = useMemo(
    () => [
      {
        key: "userName",
        title: "Utilisateur",
        width: 1,
        render: (_: unknown, row: AccountEvent) => (
          <span className="text-[13px] lg:text-[18px] font-bold tracking-[-0.39px] lg:tracking-[-0.54px] text-foreground">
            {row.userName}
          </span>
        ),
      },
      {
        key: "action",
        title: "Action",
        width: 1,
        render: (_: unknown, row: AccountEvent) => <EventActionLabel action={row.action} />,
      },
      {
        key: "description",
        title: "Description",
        width: 1.5,
        minBreakpoint: 1024,
        render: (_: unknown, row: AccountEvent) => (
          <span className="text-[16px] font-medium tracking-[-0.48px] text-foreground">{row.description}</span>
        ),
      },
      {
        key: "performedBy",
        title: "Par",
        width: 0.8,
        minBreakpoint: 1024,
        render: (_: unknown, row: AccountEvent) => (
          <span className="text-[16px] font-medium tracking-[-0.48px] text-text-secondary">{row.performedBy}</span>
        ),
      },
      {
        key: "createdAt",
        title: "Date",
        width: 0.8,
        render: (_: unknown, row: AccountEvent) => (
          <span className="text-[13px] lg:text-[16px] font-medium tracking-[-0.39px] lg:tracking-[-0.48px] text-foreground">
            {row.createdAt}
          </span>
        ),
      },
    ],
    []
  )

  const fetcher = useMemo(
    () =>
      async (params: TableFetchParams): Promise<TableFetcherResult<AccountEvent>> => {
        return accountEventsService.getEvents({
          page: params.page,
          limit: params.limit,
          ...(params.search && { search: params.search }),
          ...(params.quickFilter && { quickFilter: params.quickFilter }),
        })
      },
    []
  )

  const schema: TableSchema<AccountEvent> = useMemo(
    () => ({
      key: "gestion-events",
      title: "Historique",
      searchPlaceholder: "Rechercher un événement...",
      api: {
        fetcher,
        queryKey: QUERY_KEYS.ACCOUNT_EVENTS,
        defaultLimit: 10,
      },
      columns,
      filters: { quickFilters: ACTION_FILTERS },
      ui: {
        showRefresh: true,
        showExport: true,
        exportLabel: "Exporter",
        showRowBorder: false,
        headerLayout: "single-row",
        searchWidth: "w-[308px]",
        containerClassName: "rounded-none",
        paginationVariant: "compact",
        minHeight: "400px",
        rowClassName: "h-[46px] lg:h-[58px]",
        noDataComponent: (
          <EmptyState
            title="Aucun événement"
            message="Aucun événement enregistré pour le moment."
            icon={<History size={40} strokeWidth={1.2} />}
          />
        ),
      },
    }),
    [columns, fetcher]
  )

  return <TableKit schema={schema} />
}
