"use client"

import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { storesService } from "@/services/stores/stores.service"
import { useStoreDetailStore } from "@/store/storeDetail.store"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

export function useStoreDetailQuery(id: string) {
  const setStoreName = useStoreDetailStore((s) => s.setStoreName)
  const setLoading = useStoreDetailStore((s) => s.setLoading)

  const { data: store, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.STORE_DETAIL, id],
    queryFn: () => storesService.getStoreById(id),
    enabled: !!id,
  })

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading, setLoading])

  useEffect(() => {
    if (store?.name) {
      setStoreName(store.name)
      document.title = `${store.name} | Auchan Super Admin`
    }
    return () => {
      document.title = "Magasins | Auchan Super Admin"
    }
  }, [store?.name, setStoreName])

  return { store, isLoading }
}
