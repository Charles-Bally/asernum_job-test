
export type TransactionRow = {
  type: string
  store: string
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
