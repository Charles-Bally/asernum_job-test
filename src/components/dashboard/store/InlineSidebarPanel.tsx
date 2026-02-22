"use client"

import type { SidebarConfig } from "@/components/sidebar_system"
import { renderSidebar } from "@/components/sidebar_system"
import { X } from "lucide-react"

type InlineSidebarPanelProps = {
  config: SidebarConfig
  onClose: () => void
}

export function InlineSidebarPanel({ config, onClose }: InlineSidebarPanelProps) {
  return (
    <div className="w-[386px] rounded-[20px] bg-white sticky top-[185px] h-full max-h-[calc(100dvh-210px)] overflow-y-auto">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-[24px] top-[24px] z-10 cursor-pointer text-text-secondary hover:text-foreground"
      >
        <X size={24} />
      </button>
      {renderSidebar(config)}
    </div>
  )
}
