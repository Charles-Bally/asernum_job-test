
import type { StoreData } from "@/components/dashboard/StoreCard"

export type StoreDetail = {
  id: string
  name: string
  code: string
  city: string
  manager: string
  responsableCaisse: string
  nbCaissiers: number
  nbTransactions: number
  stats: { renduMonnaie: number; paiementCourse: number }
}

export type StoresData = {
  rows: StoreData[]
  total: number
  page: number
  totalPages: number
  communes: string[]
}
