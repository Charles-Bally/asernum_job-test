
"use client"

import { EmptyState } from "@/components/ui/render/EmptyState"
import CustomLink from "@/components/ui/render/CustomLink"
import { useTopStoresQuery } from "@/hooks/useDashboardController"
import { PATHNAME } from "@/constants/pathname.constant"
import { Store } from "lucide-react"
import { useRef } from "react"
import { StoreCard } from "./StoreCard"
import { StoreCardSkeleton } from "./StoreCardSkeleton"
import { useScrollMask } from "./useScrollMask"

function TopStoresSkeleton() {
  return (
    <div className="mt-[20px] flex gap-[20px] overflow-hidden pb-[20px]">
      {Array.from({ length: 4 }).map((_, i) => (
        <StoreCardSkeleton key={i} index={i} />
      ))}
    </div>
  )
}

export function TopStoresSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const maskStyle = useScrollMask(scrollRef)
  const { stores, isLoading } = useTopStoresQuery()

  return (
    <div className="flex h-[330px] flex-1 flex-col overflow-hidden rounded-[40px] bg-auchan-red-light px-[33px] pt-[25px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[28px] font-bold leading-normal tracking-[-0.84px] text-text-caption">
          Les magasins qui transactent le plus
        </h2>
        <CustomLink
          href={PATHNAME.DASHBOARD.store.listing}
          variant="none"
          size="none"
          animation={true}
          className="shrink-0 rounded-[10px] h-[40px] border-3 border-auchan-red px-[14px] py-[9px] text-[18px] font-bold tracking-[-0.54px] text-auchan-red"
        >
          {`Tous les magasins >`}
        </CustomLink>
      </div>

      {isLoading ? (
        <TopStoresSkeleton />
      ) : stores.length === 0 ? (
        <EmptyState
          title="Aucun magasin"
          message="Aucun magasin actif pour le moment."
          icon={<Store size={40} strokeWidth={1.2} />}
          className="flex-1 py-0"
        />
      ) : (
        <div
          ref={scrollRef}
          className="mt-[20px] flex gap-[20px] overflow-x-auto pb-[20px] scrollbar-none"
          style={maskStyle}
        >
          {stores.map((store, i) => (
            <StoreCard key={i} store={store} />
          ))}
        </div>
      )}
    </div>
  )
}
