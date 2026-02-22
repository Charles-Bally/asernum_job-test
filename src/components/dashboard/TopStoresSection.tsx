
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
    <div className="mt-3 lg:mt-[20px] flex gap-2.5 lg:gap-[20px] overflow-hidden pb-4 lg:pb-[20px]">
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
    <div className="flex min-h-0 lg:h-[330px] flex-1 flex-col overflow-hidden rounded-[20px] lg:rounded-[40px] bg-auchan-red-light px-4 lg:px-[33px] pt-4 lg:pt-[25px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-[17px] lg:text-[28px] font-bold leading-tight lg:leading-normal tracking-[-0.51px] lg:tracking-[-0.84px] text-text-caption">
          Les magasins qui transactent le plus
        </h2>
        <CustomLink
          href={PATHNAME.DASHBOARD.store.listing}
          variant="none"
          size="none"
          animation={true}
          className="mt-0.5 shrink-0 whitespace-nowrap rounded-[8px] lg:rounded-[10px] h-auto lg:h-[40px] border-[1.5px] lg:border-3 border-auchan-red px-2.5 lg:px-[14px] py-[5px] lg:py-[9px] text-[12px] lg:text-[18px] font-bold tracking-[-0.36px] lg:tracking-[-0.54px] text-auchan-red"
        >
          <span className="lg:hidden">{`Voir plus >`}</span>
          <span className="hidden lg:inline">{`Tous les magasins >`}</span>
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
          className="mt-3 lg:mt-[20px] flex gap-2.5 lg:gap-[20px] overflow-x-auto pb-4 lg:pb-[20px] scrollbar-none"
          style={maskStyle}
        >
          {stores.map((store, i) => (
            <StoreCard key={i} store={store} className="!w-[170px] lg:!w-[250px]" />
          ))}
        </div>
      )}
    </div>
  )
}
