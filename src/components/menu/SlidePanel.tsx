"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { useCallback, useEffect, type ReactNode } from "react"

type SlidePanelProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
  width?: string
  className?: string
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const panelVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
}

const transition = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }

export function SlidePanel({
  open,
  onClose,
  children,
  width = "w-[386px]",
  className,
}: SlidePanelProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, handleKeyDown])

  return (
    <AnimatePresence mode="sync">
      {open && (
        <motion.div
          key="slide-panel-wrapper"
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-40"
        >
          <motion.div
            variants={overlayVariants}
            transition={transition}
            className="absolute inset-0 bg-black/10"
            onClick={onClose}
          />
          <motion.div
            variants={panelVariants}
            transition={transition}
            className={cn(
              "absolute right-0 top-0 h-full overflow-y-auto bg-white shadow-xl",
              width,
              className
            )}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-[24px] top-[24px] z-10 cursor-pointer text-text-secondary hover:text-foreground"
            >
              <X size={24} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
