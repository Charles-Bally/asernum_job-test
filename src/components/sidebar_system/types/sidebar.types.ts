import type { ComponentType } from "react"

export type SidebarEntity = "cashier-detail" | "transaction-detail"

export type SidebarConfig = {
  entity: SidebarEntity
  entityId: string
  params?: Record<string, string>
}

export type SidebarComponentProps = {
  config: SidebarConfig
}

export type SidebarRegistryEntry = ComponentType<SidebarComponentProps>

export type SidebarStore = {
  config: SidebarConfig | null
  isOpen: boolean
  inline: boolean
  open: (config: SidebarConfig) => void
  close: () => void
  setInline: (inline: boolean) => void
}
