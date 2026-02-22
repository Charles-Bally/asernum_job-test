"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export type StoreTab = "transactions" | "caissiers"

type StoreDetailTabsProps = {
  activeTab: StoreTab
  onTabChange: (tab: StoreTab) => void
  className?: string
}

const TABS: { key: StoreTab; label: string }[] = [
  { key: "transactions", label: "Transactions" },
  { key: "caissiers", label: "Caissiers" },
]

export function StoreDetailTabs({ activeTab, onTabChange, className }: StoreDetailTabsProps) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center gap-[6px] rounded-[14px] bg-border-light p-[5px]",
        className
      )}
    >
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={cn(
            "relative z-10 h-[38px] w-[143px] cursor-pointer rounded-[10px] text-[16px] font-bold tracking-[-0.48px]",
            activeTab === tab.key
              ? "text-foreground"
              : "text-foreground hover:text-foreground/70"
          )}
        >
          {activeTab === tab.key && (
            <motion.div
              layoutId="store-tab-indicator"
              className="absolute inset-0 rounded-[10px] bg-white shadow-sm"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
