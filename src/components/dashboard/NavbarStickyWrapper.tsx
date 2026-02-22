
"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

export function NavbarStickyWrapper({ children }: { children: ReactNode }) {

  return (
    <div
      className={cn(
        "sticky top-0 z-30 bg-surface-page px-4 lg:px-0 pt-3 lg:pt-[26px] mx-auto max-w-[1370px] w-full",
        "pb-2 md:pb-0"
      )}
    >
      {children}
    </div>
  )
}
