
"use client"

import { cn } from "@/lib/utils"

function Bone({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-[8px] bg-surface-muted", className)} />
  )
}

export function StoreInfoCardSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-start justify-between rounded-[20px] bg-white px-5 py-5 lg:px-[40px] lg:py-[32px] gap-5 lg:gap-0">
      <div className="grid flex-1 grid-cols-2 lg:grid-cols-3 gap-x-3 lg:gap-x-[60px] gap-y-4 lg:gap-y-[28px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-[6px]">
            <Bone className="h-[18px] lg:h-[24px] w-[80px] lg:w-[120px]" />
            <Bone className="h-[24px] lg:h-[32px] w-[120px] lg:w-[180px]" />
          </div>
        ))}
      </div>
      <div className="flex items-center size-24 lg:size-32 justify-center relative mx-auto lg:mx-0">
        <Bone className="size-full z-10 rounded-full" />
        <div className="absolute size-[80%] z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full flex items-center justify-center" />
      </div>
    </div>
  )
}
