import type { ReactNode } from "react"
import type { SidebarConfig, SidebarRegistryEntry } from "../types/sidebar.types"

const sidebarRegistry = new Map<string, SidebarRegistryEntry>()

export function registerSidebar(entity: string, component: SidebarRegistryEntry) {
  sidebarRegistry.set(entity, component)
}

export function renderSidebar(config: SidebarConfig): ReactNode {
  const Component = sidebarRegistry.get(config.entity)
  if (!Component) return null
  return <Component config={config} />
}
