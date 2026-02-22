
export type ClientStatus = "active" | "inactive"

export type Client = {
  id: string
  phone: string
  firstName: string
  lastName: string
  store: string
  storeCode: string
  totalPurchases: number
  transactionCount: number
  lastVisit: string
  status: ClientStatus
}

export type ClientsData = {
  rows: Client[]
  total: number
  page: number
  totalPages: number
}
