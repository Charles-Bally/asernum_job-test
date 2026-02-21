"use client"

import { cn } from "@/lib/utils"
import { useTabPersistence } from "../hooks/useTabPersistence"
import type { TableKitMultiTabProps } from "../types/table.types"

export function TableKitTabs({
  tabs,
  variant = "pill",
  persistKey,
  children,
}: TableKitMultiTabProps) {
  const { activeTab, setActiveTab } = useTabPersistence(tabs[0]?.key ?? "", persistKey)

  return (
    <div>
      {/* Tabs selector */}
      {variant === "pill" && (
        <div className="inline-flex items-center rounded-[20px] bg-surface-muted p-[4px]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "rounded-[20px] px-[20px] py-[8px] text-[14px] transition-all",
                activeTab === tab.key
                  ? "bg-white font-bold text-text-caption shadow-sm"
                  : "font-normal text-text-caption hover:text-text-tertiary"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {variant === "underline" && (
        <div className="flex gap-[24px] border-b border-border-light">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "pb-[10px] text-[14px] transition-all",
                activeTab === tab.key
                  ? "border-b-2 border-auchan-red font-bold text-text-caption"
                  : "font-normal text-text-secondary"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="mt-[20px]">{children(activeTab)}</div>
    </div>
  )
}
