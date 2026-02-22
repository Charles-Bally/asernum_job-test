
"use client"

import CustomButton from "@/components/ui/render/CustomButton"
import CustomIcon from "@/components/ui/render/CustomIcon"
import ICONS from "@/constants/icons.constant"
import { cn } from "@/lib/utils"
import { PATHNAME } from "@/constants/pathname.constant"
import { useRouter } from "next/navigation"

type StoreDetailHeaderProps = {
  className?: string
}

export function StoreDetailHeader({ className }: StoreDetailHeaderProps) {
  const router = useRouter()

  return (
    <div className={cn("flex items-center gap-1.5 lg:gap-2", className)}>
      <CustomButton
        onClick={() => router.push(PATHNAME.DASHBOARD.store.listing)}
        variant="none"
        size="none"
        ariaLabel="Retour"
        animation={false}
      >
        <CustomIcon config={ICONS.stores.arrowBack} className="size-[28px] lg:size-[40px]" />
      </CustomButton>
      <h1 className="text-[20px] lg:text-[36px] font-bold tracking-[-0.6px] lg:tracking-[-1.08px] text-foreground">
        Détails Magasin
      </h1>
    </div>
  )
}
