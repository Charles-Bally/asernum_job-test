"use client"

import CustomIcon from "@/components/ui/render/CustomIcon"
import ICONS from "@/constants/icons.constant"
import { cn } from "@/lib/utils"

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
  return (
    <div
      className={cn(
        "group relative flex h-[200px] w-[250px] shrink-0 cursor-pointer flex-col rounded-[40px] px-[28px] pb-[28px] pt-[28px]",
        className
      )}
    >
      {/* Fond blanc (default) */}
      <div className="absolute inset-0 rounded-[40px] bg-white transition-opacity duration-300 group-hover:opacity-0" />

      {/* Fond gradient (hover) */}
      <div className="store-card-gradient absolute inset-0 rounded-[40px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

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

        <p className="mt-auto text-[20px] font-black tracking-[-0.6px] text-foreground transition-colors duration-300 group-hover:text-white">
          {store.name}
        </p>

        <div className="mt-[6px] flex items-center gap-[6px]">
          <span className="text-[12px] font-medium tracking-[-0.36px] text-text-secondary opacity-100 transition-[opacity,max-width] duration-300 max-w-[60px] overflow-hidden group-hover:max-w-0 group-hover:opacity-0">
            {store.code}
          </span>
          <CustomIcon
            config={ICONS.stores.locationPin}
            className="transition-[filter] duration-300 group-hover:brightness-0 group-hover:invert"
          />
          <span className="text-[12px] font-medium tracking-[-0.36px] text-text-secondary transition-colors duration-300 group-hover:text-white">
            {store.city}
          </span>
        </div>
      </div>
    </div>
  )
}
