
"use client"

import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { dashboardService } from "@/services/dashboard/dashboard.service"
import { useQuery } from "@tanstack/react-query"

export function useBalanceQuery() {
  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.DASHBOARD.BALANCE],
    queryFn: () => dashboardService.getBalance(),
  })

  return {
    balance: data?.balance ?? 0,
    isLoading,
  }
}

export function useTopStoresQuery() {
  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.DASHBOARD.TOP_STORES],
    queryFn: () => dashboardService.getTopStores(),
  })

  return {
    stores: data?.stores ?? [],
    isLoading,
  }
}

export function useStatsQuery(period: string) {
  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.DASHBOARD.STATS, period],
    queryFn: () => dashboardService.getStats(period),
  })

  return {
    renduMonnaie: data?.renduMonnaie ?? 0,
    paiementCourse: data?.paiementCourse ?? 0,
    activeStores: data?.activeStores ?? 0,
    isLoading,
  }
}
