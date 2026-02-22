import { StatistiquesContent } from "@/components/dashboard/statistiques/StatistiquesContent"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { dashboardService } from "@/services/dashboard/dashboard.service"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Statistiques | Asernum",
}

export default async function StatistiquesPage() {
  const queryClient = new QueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [...QUERY_KEYS.DASHBOARD.BALANCE],
      queryFn: () => dashboardService.getBalance(),
    }),
    queryClient.prefetchQuery({
      queryKey: [...QUERY_KEYS.DASHBOARD.TOP_STORES],
      queryFn: () => dashboardService.getTopStores(),
    }),
    queryClient.prefetchQuery({
      queryKey: [...QUERY_KEYS.DASHBOARD.STATS, "30days"],
      queryFn: () => dashboardService.getStats("30days"),
    }),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StatistiquesContent />
    </HydrationBoundary>
  )
}
