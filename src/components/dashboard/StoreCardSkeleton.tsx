"use client"

import { motion } from "framer-motion"

type StoreCardSkeletonProps = {
  index: number
}

export function StoreCardSkeleton({ index }: StoreCardSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="flex h-[150px] lg:h-[200px] w-[170px] lg:w-[250px] shrink-0 flex-col rounded-[20px] lg:rounded-[40px] bg-white px-4 lg:px-[28px] pb-4 lg:pb-[28px] pt-4 lg:pt-[28px]"
    >
      <div className="flex items-start justify-between">
        <div className="size-[26px] lg:size-[32px] animate-pulse rounded-[8px] lg:rounded-[10px] bg-surface-muted" />
        <div className="size-[16px] lg:size-[20px] animate-pulse rounded-[5px] lg:rounded-[6px] bg-surface-muted" />
      </div>

      <div className="mt-auto">
        <div className="h-[16px] lg:h-[20px] w-[90px] lg:w-[120px] animate-pulse rounded-[5px] lg:rounded-[6px] bg-surface-muted" />
      </div>

      <div className="mt-1.5 lg:mt-[10px] flex items-center gap-1.5 lg:gap-[8px]">
        <div className="h-[10px] lg:h-[12px] w-[30px] lg:w-[40px] animate-pulse rounded-[3px] lg:rounded-[4px] bg-surface-muted" />
        <div className="h-[10px] lg:h-[12px] w-[60px] lg:w-[80px] animate-pulse rounded-[3px] lg:rounded-[4px] bg-surface-muted" />
      </div>
    </motion.div>
  )
}
