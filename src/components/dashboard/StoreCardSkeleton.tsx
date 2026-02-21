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
      className="flex h-[200px] w-[250px] flex-col rounded-[40px] bg-white px-[28px] pb-[28px] pt-[28px]"
    >
      <div className="flex items-start justify-between">
        <div className="size-[32px] animate-pulse rounded-[10px] bg-surface-muted" />
        <div className="size-[20px] animate-pulse rounded-[6px] bg-surface-muted" />
      </div>

      <div className="mt-auto">
        <div className="h-[20px] w-[120px] animate-pulse rounded-[6px] bg-surface-muted" />
      </div>

      <div className="mt-[10px] flex items-center gap-[8px]">
        <div className="h-[12px] w-[40px] animate-pulse rounded-[4px] bg-surface-muted" />
        <div className="h-[12px] w-[80px] animate-pulse rounded-[4px] bg-surface-muted" />
      </div>
    </motion.div>
  )
}
