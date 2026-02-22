
"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

export function NavbarStickyWrapper({ children }: { children: ReactNode }) {

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-30 bg-surface-page px-4 lg:px-0 pt-3 lg:pt-[26px] mx-auto max-w-[1370px] w-full",
        "pb-2 md:pb-0"
      )}
    >
      {children}
    </motion.div>
  )
}
