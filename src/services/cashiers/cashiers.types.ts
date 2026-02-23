export type CashierStatus = "Actif" | "Bloqué"

export type CashierRow = {
  id: string
  username: string
  accessKey: string
  assignedDate: string
  status: CashierStatus
}

export type CashiersData = {
  rows: CashierRow[]
  total: number
  page: number
  totalPages: number
}
