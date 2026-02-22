"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export type PillTab = {
  key: string
  label: string
}

type PillTabsProps = {
  tabs: PillTab[]
  activeTab: string
  onTabChange: (key: string) => void
  layoutId: string
  className?: string
}

export function PillTabs({ tabs, activeTab, onTabChange, layoutId, className }: PillTabsProps) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center gap-[4px] lg:gap-[6px] rounded-[12px] lg:rounded-[14px] bg-border-light p-[4px] lg:p-[5px]",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={cn(
            "relative z-10 h-[32px] lg:h-[38px] w-[110px] lg:w-[143px] cursor-pointer rounded-[8px] lg:rounded-[10px] text-[13px] lg:text-[16px] font-bold tracking-[-0.39px] lg:tracking-[-0.48px]",
            activeTab === tab.key
              ? "text-foreground"
              : "text-foreground hover:text-foreground/70"
          )}
        >
          {activeTab === tab.key && (
            <motion.div
              layoutId={layoutId}
              className="absolute inset-0 rounded-[8px] lg:rounded-[10px] bg-white shadow-sm"
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
