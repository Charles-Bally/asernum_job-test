"use client"

import { GlobalBalanceCard } from "@/components/dashboard/GlobalBalanceCard"
import { TopStoresSection } from "@/components/dashboard/TopStoresSection"

export default function DashboardHomePage() {
  return (
    <div className="flex gap-[20px]">
      <GlobalBalanceCard balance={9231000} />
      <TopStoresSection />
    </div>
  )
}
