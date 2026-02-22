import type { Metadata } from "next"
import { TransactionsContent } from "@/components/dashboard/transactions/TransactionsContent"

export const metadata: Metadata = {
  title: "Transactions | Asernum",
}

export default function TransactionsPage() {
  return <TransactionsContent />
}
