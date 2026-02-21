"use client"

import CustomIcon from "@/components/ui/render/CustomIcon"
import ICONS from "@/constants/icons.constant"

export type StoreData = {
  name: string
  code: string
  city: string
}

type StoreCardProps = {
  store: StoreData
}

export function StoreCard({ store }: StoreCardProps) {
  return (
    <div className="flex h-[200px] w-[250px] shrink-0 flex-col rounded-[40px] bg-white px-[28px] pt-[28px] pb-[28px]">
      <div className="flex items-start justify-between">
        <CustomIcon config={ICONS.stores.store} />
        <div className="-rotate-45">
          <CustomIcon config={ICONS.stores.arrowTopRight} />
        </div>
      </div>

      <p className="mt-auto text-[20px] font-black tracking-[-0.6px] text-foreground">
        {store.name}
      </p>

      <div className="mt-[6px] flex items-center gap-[6px]">
        <span className="text-[12px] font-medium tracking-[-0.36px] text-text-secondary">
          {store.code}
        </span>
        <CustomIcon config={ICONS.stores.locationPin} />
        <span className="text-[12px] font-medium tracking-[-0.36px] text-text-secondary">
          {store.city}
        </span>
      </div>
    </div>
  )
}
