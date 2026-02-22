"use client"

import { useMediaQuery } from "@/hooks/useMediaQuery"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion, type PanInfo } from "framer-motion"
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

const sidePanelVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
}

const bottomSheetVariants = {
  hidden: { y: "100%" },
  visible: { y: 0 },
  exit: { y: "100%" },
}

const transition = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }

const DRAG_CLOSE_THRESHOLD = 80

export function SlidePanel({
  open,
  onClose,
  children,
  width = "w-[386px]",
  className,
}: SlidePanelProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [open, handleKeyDown])

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (info.offset.y > DRAG_CLOSE_THRESHOLD || info.velocity.y > 500) {
        onClose()
      }
    },
    [onClose]
  )

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
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          {isDesktop ? (
            <motion.div
              variants={sidePanelVariants}
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
          ) : (
            <motion.div
              variants={bottomSheetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={transition}
              drag="y"
              dragDirectionLock
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.4 }}
              onDragEnd={handleDragEnd}
              className={cn(
                "absolute inset-x-0 bottom-0 flex h-[90dvh] flex-col rounded-t-[24px] bg-white shadow-xl",
                className
              )}
            >
              {/* Drag handle */}
              <div className="flex shrink-0 cursor-grab justify-center pt-3 pb-1 active:cursor-grabbing">
                <div className="h-[5px] w-[48px] rounded-full bg-border-light" />
              </div>
              <button
                type="button"
                onClick={onClose}
                className="absolute right-[20px] top-[12px] z-10 cursor-pointer text-text-secondary hover:text-foreground"
              >
                <X size={22} />
              </button>
              <div className="flex-1 overflow-y-auto">{children}</div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
