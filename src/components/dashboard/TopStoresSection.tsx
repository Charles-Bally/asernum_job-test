"use client"

import CustomLink from "@/components/ui/render/CustomLink"
import { PATHNAME } from "@/constants/pathname.constant"
import { useRef } from "react"
import { StoreCard, type StoreData } from "./StoreCard"
import { useScrollMask } from "./useScrollMask"

const MOCK_STORES: StoreData[] = [
  { name: "Angré Djibi 1", code: "M0001", city: "Abidjan, Cocody" },
  { name: "Angré Djibi 1", code: "M0001", city: "Abidjan, Cocody" },
  { name: "Angré Djibi 1", code: "M0001", city: "Abidjan, Cocody" },
  { name: "Angré Djibi 1", code: "M0001", city: "Abidjan, Cocody" },
  { name: "Angré Djibi 1", code: "M0001", city: "Abidjan, Cocody" },
]

type TopStoresSectionProps = {
  stores?: StoreData[]
}

export function TopStoresSection({ stores = MOCK_STORES }: TopStoresSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const maskStyle = useScrollMask(scrollRef)

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

      {/* Store cards scroll */}
      <div
        ref={scrollRef}
        className="mt-[20px] flex gap-[20px] overflow-x-auto pb-[20px] scrollbar-none"
        style={maskStyle}
      >
        {stores.map((store, i) => (
          <StoreCard key={i} store={store} />
        ))}
      </div>
    </div>
  )
}
