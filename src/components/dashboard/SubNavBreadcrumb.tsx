"use client"

import { cn } from "@/lib/utils"
import { useStoreDetailStore } from "@/store/storeDetail.store"

export function SubNavBreadcrumb() {
  const storeName = useStoreDetailStore((s) => s.storeName)
  const isLoading = useStoreDetailStore((s) => s.isLoading)

  if (!storeName && !isLoading) return null

  return (
    <div
      className={cn(
        "flex -mt-[10px] z-10 lg:-mt-[20px] h-[40px] lg:h-[56px] items-end rounded-b-[10px] bg-auchan-red-light px-5 lg:px-[40px] pb-[6px] lg:pb-[7px]"
      )}
    >
      <p className="text-[14px] lg:text-[16px] tracking-[-0.42px] lg:tracking-[-0.48px]">
        {isLoading && !storeName ? (
          <span className="inline-block translate-y-1 h-[18px] w-[180px] animate-pulse rounded-[6px] bg-auchan-red-pastel" />
        ) : (
          <>
            <span className="font-bold text-foreground">{storeName}</span>
            <span className="font-bold text-text-secondary">{" > Détails"}</span>
          </>
        )}
      </p>
    </div>
  )
}
