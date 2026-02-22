"use client"

import { useModal } from "@/components/modal_system/hooks/useModal"
import { useSidebar } from "@/components/sidebar_system"
import type { ColumnConfig, QuickFilterConfig, TableFetchParams, TableFetcherResult, TableSchema } from "@/components/table_system"
import { TableKit } from "@/components/table_system"
import CustomButton from "@/components/ui/render/CustomButton"
import { EmptyState } from "@/components/ui/render/EmptyState"
import { usersService } from "@/services/users/users.service"
import type { User } from "@/types/user.types"
import { UserPlus, Users } from "lucide-react"
import { useCallback, useMemo } from "react"
import { UserRoleBadge } from "../cells/UserRoleBadge"
import { UserStatusBadge } from "../cells/UserStatusBadge"

const ROLE_FILTERS: QuickFilterConfig[] = [
  {
    key: "role",
    label: "Rôle",
    options: [
      { label: "Tous", value: "" },
      { label: "Administrateur", value: "ADMIN" },
      { label: "Manager", value: "MANAGER" },
      { label: "Resp. Caisses", value: "RESPONSABLE_CAISSES" },
      { label: "Caissier", value: "CAISSIER" },
    ],
  },
  {
    key: "status",
    label: "Statut",
    options: [
      { label: "Tous", value: "" },
      { label: "Actif", value: "active" },
      { label: "Bloqué", value: "blocked" },
    ],
  },
]

export function UsersTab() {
  const modal = useModal()
  const sidebar = useSidebar()

  const handleAddUser = useCallback(() => {
    modal.open({
      entity: "create-user",
      mode: "create",
      layout: "wizard",
      title: "Nouvel utilisateur",
      size: "md",
      showStepper: true,
      showStepperLabels: true,
      currentStep: 0,
      submitLabel: "Créer l'utilisateur",
    })
  }, [modal])

  const handleRowClick = useCallback(
    (row: User) => {
      sidebar.open({ entity: "user-detail", entityId: row.id })
    },
    [sidebar]
  )

  const columns: ColumnConfig<User>[] = useMemo(
    () => [
      {
        key: "firstName",
        title: "Utilisateur",
        width: 1,
        render: (_: unknown, row: User) => (
          <span className="text-[13px] lg:text-[18px] font-bold tracking-[-0.39px] lg:tracking-[-0.54px] text-foreground">
            {row.firstName} {row.lastName}
          </span>
        ),
      },
      {
        key: "email",
        title: "Email",
        width: 1.3,
        minBreakpoint: 1024,
        render: (_: unknown, row: User) => (
          <span className="text-[16px] font-medium tracking-[-0.48px] text-foreground">{row.email}</span>
        ),
      },
      {
        key: "role",
        title: "Rôle",
        width: 0.9,
        render: (_: unknown, row: User) => <UserRoleBadge role={row.role} />,
      },
      {
        key: "store",
        title: "Magasin",
        width: 1,
        minBreakpoint: 1024,
        render: (_: unknown, row: User) => (
          <span className="text-[16px] font-medium tracking-[-0.48px] text-foreground">{row.store ?? "—"}</span>
        ),
      },
      {
        key: "status",
        title: "Statut",
        width: 0.6,
        render: (_: unknown, row: User) => <UserStatusBadge status={row.status} />,
      },
    ],
    []
  )

  const fetcher = useMemo(
    () =>
      async (params: TableFetchParams): Promise<TableFetcherResult<User>> => {
        return usersService.getUsers({
          page: params.page,
          limit: params.limit,
          ...(params.search && { search: params.search }),
          ...(params.quickFilter && { quickFilter: params.quickFilter }),
        })
      },
    []
  )

  const schema: TableSchema<User> = useMemo(
    () => ({
      key: "gestion-users",
      title: "Utilisateurs",
      searchPlaceholder: "Rechercher un utilisateur...",
      api: {
        fetcher,
        queryKey: ["gestion-users"],
        defaultLimit: 10,
      },
      columns,
      filters: { quickFilters: ROLE_FILTERS },
      actions: { rowClick: handleRowClick },
      ui: {
        showExport: true,
        exportLabel: "Exporter",
        showRefresh: true,
        showRowBorder: false,
        headerLayout: "single-row",
        searchWidth: "w-[308px]",
        containerClassName: "rounded-none",
        paginationVariant: "compact",
        minHeight: "400px",
        rowClassName: "h-[46px] lg:h-[58px]",
        headerActions: (
          <CustomButton variant="primary" size="md" onClick={handleAddUser} className="h-[36px] lg:h-[46px] shrink-0 rounded-[8px] lg:rounded-[10px] px-4 lg:px-[24px] text-[13px] lg:text-[18px] font-bold gap-2">
            <UserPlus size={18} /> Nouvel utilisateur
          </CustomButton>
        ),
        noDataComponent: (
          <EmptyState
            title="Aucun utilisateur"
            message="Aucun utilisateur trouvé."
            icon={<Users size={40} strokeWidth={1.2} />}
          />
        ),
      },
    }),
    [columns, fetcher, handleRowClick, handleAddUser]
  )

  return <TableKit schema={schema} />
}
