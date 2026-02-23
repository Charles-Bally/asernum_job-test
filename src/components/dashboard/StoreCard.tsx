"use client"

import CustomIcon from "@/components/ui/render/CustomIcon"
import ICONS from "@/constants/icons.constant"
import { PATHNAME } from "@/constants/pathname.constant"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { useState } from "react"

export type StoreData = {
  name: string
  code: string
  city: string
}

type StoreCardProps = {
  store: StoreData
  className?: string
}

export function StoreCard({ store, className }: StoreCardProps) {
  const router = useRouter()
  const [navigating, setNavigating] = useState(false)

  const handleClick = () => {
    setNavigating(true)
    router.push(PATHNAME.DASHBOARD.store.details(store.code))
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={navigating}
      className={cn(
        "group relative flex h-[150px] lg:h-[200px] w-full shrink-0 cursor-pointer flex-col rounded-[20px] lg:rounded-[40px] px-4 lg:px-[28px] pb-4 lg:pb-[28px] pt-4 lg:pt-[28px]",
        className
      )}
    >
      {/* Fond blanc (default) */}
      <div className="absolute inset-0 rounded-[20px] lg:rounded-[40px] bg-white transition-opacity duration-300 group-hover:opacity-0" />

      {/* Fond gradient (hover) */}
      <div className="store-card-gradient absolute inset-0 rounded-[20px] lg:rounded-[40px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Shimmer loading */}
      {navigating && (
        <div className="absolute inset-0 z-20 overflow-hidden rounded-[20px] lg:rounded-[40px]">
          <div className="absolute inset-0 bg-white/40" />
          <div className="animate-shimmer absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>
      )}

      {/* Contenu */}
      <div className="relative z-10 flex flex-1 flex-col">
        <div className="flex items-start justify-between">
          <CustomIcon
            config={ICONS.stores.store}
            className="transition-[filter] duration-300 group-hover:brightness-0 group-hover:invert"
          />
          <div className="-rotate-45">
            <CustomIcon
              config={ICONS.stores.arrowTopRight}
              className="transition-[filter] duration-300 group-hover:brightness-0 group-hover:invert"
            />
          </div>
        </div>

        <p className="mt-auto text-left text-[14px] lg:text-[20px] font-black tracking-[-0.42px] lg:tracking-[-0.6px] text-foreground transition-colors duration-300 group-hover:text-white">
          {store.name}
        </p>

        <div className="mt-1 lg:mt-[6px] flex items-center gap-1 lg:gap-[6px]">
          <span className="text-[10px] line-clamp-1 break-all lg:text-[12px] text-left font-medium tracking-[-0.3px] lg:tracking-[-0.36px] text-text-secondary opacity-100 transition-[opacity,max-width] duration-300 max-w-[50px] lg:max-w-[60px] overflow-hidden group-hover:max-w-0 group-hover:opacity-0">
            {store.code}
          </span>
          <CustomIcon
            config={ICONS.stores.locationPin}
            className="transition-[filter] duration-300 group-hover:brightness-0 group-hover:invert"
          />
          <span className="text-[10px] lg:text-[12px] font-medium tracking-[-0.3px] lg:tracking-[-0.36px] text-text-secondary transition-colors duration-300 group-hover:text-white">
            {store.city}
          </span>
        </div>
      </div>
    </button>
  )
}
