"use client"

import { PillTabs } from "@/components/ui/render/PillTabs"

type Tab = "users" | "history"

type GestionHeaderProps = {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

const TABS = [
  { key: "users", label: "Utilisateurs" },
  { key: "history", label: "Historique" },
]

export function GestionHeader({ activeTab, onTabChange }: GestionHeaderProps) {
  return (
    <PillTabs
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={(key) => onTabChange(key as Tab)}
      layoutId="gestion-tab"
    />
  )
}
