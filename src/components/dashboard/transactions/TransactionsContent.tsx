"use client"

import { AllTransactionsTable } from "./AllTransactionsTable"

export function TransactionsContent() {
  return (

    <div className="overflow-hidden rounded-[20px] lg:rounded-[30px] bg-white">
      <AllTransactionsTable />
    </div>
  )
}
