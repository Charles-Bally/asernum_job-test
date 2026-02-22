
"use client"

import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { storesService } from "@/services/stores/stores.service"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useMemo } from "react"

type InfiniteStoresParams = {
  search: string
  commune: string
  limit?: number
}

export function useInfiniteStoresQuery({ search, commune, limit = 15 }: InfiniteStoresParams) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [...QUERY_KEYS.STORES, "infinite", { search, commune }],
    queryFn: ({ pageParam }) => storesService.getStores({ search, commune, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  })

  const stores = useMemo(() => data?.pages.flatMap((p) => p.rows) ?? [], [data])
  const communes = data?.pages[0]?.communes ?? []

  return { stores, communes, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage }
}
