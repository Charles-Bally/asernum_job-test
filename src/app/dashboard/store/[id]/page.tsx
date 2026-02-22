"use client"

import { StoreDetailContent } from "@/components/dashboard/store/StoreDetailContent"
import { useStoreDetailStore } from "@/store/storeDetail.store"
import { useParams } from "next/navigation"
import { useEffect } from "react"

export default function StoreDetailPage() {
  const { id } = useParams<{ id: string }>()
  const setStoreName = useStoreDetailStore((s) => s.setStoreName)
  const setLoading = useStoreDetailStore((s) => s.setLoading)

  useEffect(() => {
    setLoading(true)
    return () => {
      setStoreName(null)
      setLoading(false)
    }
  }, [setStoreName, setLoading])

  if (!id) return null

  return <StoreDetailContent id={id} />
}
