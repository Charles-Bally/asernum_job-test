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
        "-mt-[20px] flex h-[62px] items-end rounded-b-[10px] bg-auchan-red-light px-[40px] pb-[7px]"
      )}
    >
      <p className="text-[16px] tracking-[-0.48px]">
        {isLoading && !storeName ? (
          <span className="inline-block h-[18px] w-[180px] animate-pulse rounded-[6px] bg-auchan-red-pastel" />
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
