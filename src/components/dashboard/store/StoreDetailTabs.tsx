"use client"

import { PillTabs } from "@/components/ui/render/PillTabs"

export type StoreTab = "transactions" | "caissiers"

type StoreDetailTabsProps = {
  activeTab: StoreTab
  onTabChange: (tab: StoreTab) => void
  className?: string
}

const TABS = [
  { key: "transactions", label: "Transactions" },
  { key: "caissiers", label: "Caissiers" },
]

export function StoreDetailTabs({ activeTab, onTabChange, className }: StoreDetailTabsProps) {
  return (
    <PillTabs
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={(key) => onTabChange(key as StoreTab)}
      layoutId="store-tab-indicator"
      className={className}
    />
  )
}
