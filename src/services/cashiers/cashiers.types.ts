export type CashierStatus = "Actif" | "Bloqué"

export type StoreHistory = {
  location: string
  period: string
}

export type RecentTransaction = {
  type: string
  amount: string
}

export type CashierRow = {
  id: string
  username: string
  accessKey: string
  assignedDate: string
  status: CashierStatus
  storeHistory: StoreHistory[]
  recentTransactions: RecentTransaction[]
}

export type CashiersData = {
  rows: CashierRow[]
  total: number
  page: number
  totalPages: number
}

export type CashierTransaction = {
  id: string
  type: string
  amount: string
  store: string
  client: string | null
  date: string
}

export type CashierTransactionsData = {
  rows: CashierTransaction[]
  total: number
  page: number
  totalPages: number
}
