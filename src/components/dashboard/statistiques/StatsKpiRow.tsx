"use client"

import { useStatsQuery, useTopStoresQuery } from "@/hooks/useDashboardController"

function KpiSkeleton() {
  return (
    <div className="flex flex-col gap-1.5 rounded-[16px] lg:rounded-[20px] bg-white px-5 lg:px-[28px] py-4 lg:py-[22px]">
      <div className="h-[12px] lg:h-[13px] w-[80px] animate-pulse rounded-[5px] bg-surface-muted" />
      <div className="h-[22px] lg:h-[28px] w-[60px] animate-pulse rounded-[8px] bg-surface-muted" />
    </div>
  )
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-[16px] lg:rounded-[20px] bg-white px-5 lg:px-[28px] py-4 lg:py-[22px]">
      <span className="text-[11px] lg:text-[13px] font-medium text-text-secondary">
        {label}
      </span>
      <span className="text-[20px] lg:text-[26px] font-black tracking-[-0.6px] lg:tracking-[-0.78px] text-foreground">
        {value}
      </span>
    </div>
  )
}

export function StatsKpiRow() {
  const { renduMonnaie, paiementCourse, isLoading: statsLoading } = useStatsQuery("30days")
  const { stores, isLoading: storesLoading } = useTopStoresQuery()

  const total = renduMonnaie + paiementCourse
  const isLoading = statsLoading || storesLoading

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-[16px]">
        {Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-[16px]">
      <KpiCard label="Total transactions" value={total.toLocaleString("fr-FR")} />
      <KpiCard label="Rendu monnaie" value={renduMonnaie.toLocaleString("fr-FR")} />
      <KpiCard label="Paiement course" value={paiementCourse.toLocaleString("fr-FR")} />
      <KpiCard label="Magasins actifs" value={String(stores.length)} />
    </div>
  )
}
