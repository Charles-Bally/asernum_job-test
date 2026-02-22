
"use client"

import { EmptyState } from "@/components/ui/render/EmptyState"
import { cn } from "@/lib/utils"
import { useWindowVirtualizer } from "@tanstack/react-virtual"
import { motion } from "framer-motion"
import { Store } from "lucide-react"
import { useEffect, useState, useSyncExternalStore } from "react"
import { useInView } from "react-intersection-observer"
import { StoreCard, type StoreData } from "./StoreCard"
import { StoreCardSkeleton } from "./StoreCardSkeleton"

type StoresInfiniteGridProps = {
  stores: StoreData[]
  isLoading: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  onAddStore?: () => void
}

const CARD_HEIGHT = 150
const ROW_GAP = 12
const SKELETON_COUNT = 4

const STAGGER_DELAY = 0.05

function getColumns() {
  return window.innerWidth >= 640 ? 3 : 2
}

function useColumns() {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("resize", cb)
      return () => window.removeEventListener("resize", cb)
    },
    getColumns,
    () => 2
  )
}

export function StoresInfiniteGrid({
  stores, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage, onAddStore,
}: StoresInfiniteGridProps) {
  const columns = useColumns()
  const [scrollMargin, setScrollMargin] = useState(0)
  const [animatedCount, setAnimatedCount] = useState(0)

  const { ref: sentinelRef, inView } = useInView({ threshold: 0 })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedCount(stores.length), 600)
    return () => clearTimeout(timer)
  }, [stores.length])

  const totalItems = stores.length + (isFetchingNextPage ? SKELETON_COUNT : 0)
  const rowCount = Math.ceil(totalItems / columns)

  const virtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => CARD_HEIGHT + ROW_GAP,
    overscan: 4,
    scrollMargin,
  })

  if (isLoading) {
    return (
      <div className={cn("grid gap-3", columns === 3 ? "grid-cols-3" : "grid-cols-2")}>
        {Array.from({ length: 6 }).map((_, i) => (
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
    <div
      ref={(node) => {
        if (node) setScrollMargin(node.offsetTop)
      }}
    >
      <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const startIndex = virtualRow.index * columns

          return (
            <div
              key={virtualRow.key}
              className={cn(
                "absolute left-0 w-full grid gap-3",
                columns === 3 ? "grid-cols-3" : "grid-cols-2"
              )}
              style={{
                transform: `translateY(${virtualRow.start - scrollMargin}px)`,
              }}
            >
              {Array.from({ length: columns }).map((_, colIdx) => {
                const idx = startIndex + colIdx
                if (idx >= totalItems) return <div key={`empty-${colIdx}`} />

                if (idx >= stores.length) {
                  return <StoreCardSkeleton key={`skeleton-${idx}`} index={idx - stores.length} />
                }

                const store = stores[idx]
                const isNew = idx >= animatedCount
                return (
                  <motion.div
                    key={`${store.code}-${idx}`}
                    initial={isNew ? { opacity: 0, y: 16, scale: 0.97 } : false}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={isNew ? {
                      duration: 0.3,
                      ease: [0.25, 0.1, 0.25, 1],
                      delay: (idx - animatedCount) * STAGGER_DELAY,
                    } : { duration: 0 }}
                  >
                    <StoreCard store={store} />
                  </motion.div>
                )
              })}
            </div>
          )
        })}
      </div>

      {hasNextPage && <div ref={sentinelRef} className="h-1" />}

      {!hasNextPage && stores.length > 0 && (
        <p className="py-6 text-center text-[13px] font-medium text-text-secondary">
          Tous les magasins ont été chargés
        </p>
      )}
    </div>
  )
}
