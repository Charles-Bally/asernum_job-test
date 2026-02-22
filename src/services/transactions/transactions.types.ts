
export type TransactionRow = {
  id: string
  type: string
  store: string
  storeCode: string
  amount: number
  client: string | null
  date: string
}

export type TransactionsData = {
  rows: TransactionRow[]
  total: number
  page: number
  totalPages: number
}
