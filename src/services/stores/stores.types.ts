
import type { StoreData } from "@/components/dashboard/StoreCard"

export type StoresData = {
  rows: StoreData[]
  total: number
  page: number
  totalPages: number
  communes: string[]
}
