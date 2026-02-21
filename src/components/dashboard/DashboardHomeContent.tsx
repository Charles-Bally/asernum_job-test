
"use client"

import { GlobalBalanceCard } from "@/components/dashboard/GlobalBalanceCard"
import { StatisticsSection } from "@/components/dashboard/StatisticsSection"
import { TopStoresSection } from "@/components/dashboard/TopStoresSection"
import { TransactionsPreview } from "@/components/dashboard/TransactionsPreview"

export function DashboardHomeContent() {
  return (
    <div className="flex flex-col gap-[20px]">
      {/* Row 1 : Solde + Magasins */}
      <div className="flex gap-[20px]">
        <GlobalBalanceCard />
        <TopStoresSection />
      </div>

      {/* Row 2 : Transactions + Statistiques */}
      <div className="flex gap-[20px]">
        <TransactionsPreview />
        <StatisticsSection />
      </div>
    </div>
  )
}
