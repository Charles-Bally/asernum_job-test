"use client"

import { StoreDetailContent } from "@/components/dashboard/store/StoreDetailContent"
import { useStoreDetailStore } from "@/store/storeDetail.store"
import { useEffect } from "react"

export function StoreDetailClient({ id }: { id: string }) {
  const setStoreName = useStoreDetailStore((s) => s.setStoreName)
  const setLoading = useStoreDetailStore((s) => s.setLoading)

  useEffect(() => {
    setLoading(true)
    return () => {
      setStoreName(null)
      setLoading(false)
    }
  }, [setStoreName, setLoading])

  return <StoreDetailContent id={id} />
}
