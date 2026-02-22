
"use client"

import { EmptyState } from "@/components/ui/render/EmptyState"
import { AnimatePresence, type Variants, motion } from "framer-motion"
import { Store } from "lucide-react"
import { StoreCard, type StoreData } from "./StoreCard"
import { StoreCardSkeleton } from "./StoreCardSkeleton"

type StoresGridProps = {
  stores: StoreData[]
  isLoading: boolean
  skeletonCount?: number
  onAddStore?: () => void
}

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const item: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.97,
    transition: { duration: 0.15 },
  },
}

export function StoresGrid({ stores, isLoading, skeletonCount = 15, onAddStore }: StoresGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-[29px]">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <StoreCardSkeleton key={`skeleton-${i}`} index={i} />
        ))}
      </div>
    )
  }

  if (stores.length === 0) {
    return (
      <EmptyState
        title="Aucun magasin trouvé"
        message="Aucun magasin ne correspond à votre recherche."
        icon={<Store size={48} strokeWidth={1.2} />}
        action={onAddStore ? { label: "Ajouter un magasin", onClick: onAddStore } : undefined}
        className="rounded-[40px] bg-white"
      />
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stores.map((s) => s.code).join(",")}
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-[29px]"
      >
        {stores.map((store, i) => (
          <motion.div key={`${store.code}-${i}`} variants={item}>
            <StoreCard store={store} />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}
