
"use client"

import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { storesService } from "@/services/stores/stores.service"
import { useQuery } from "@tanstack/react-query"

type StoresParams = {
  search: string
  commune: string
  page: number
  limit?: number
}

export function useStoresQuery({ search, commune, page, limit = 15 }: StoresParams) {
  const { data, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.STORES, { search, commune, page }],
    queryFn: () => storesService.getStores({ search, commune, page, limit }),
  })

  const { data: communes = [] } = useQuery({
    queryKey: QUERY_KEYS.STORE_TOP_COMMUNES,
    queryFn: () => storesService.getTopCommunes(),
  })

  return {
    stores: data?.rows ?? [],
    communes,
    page: data?.page ?? page,
    totalPages: data?.totalPages ?? 1,
    isLoading,
  }
}
