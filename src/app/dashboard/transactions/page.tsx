import { TransactionsContent } from "@/components/dashboard/transactions/TransactionsContent"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Transactions | Auchan Super Admin",
}

export default function TransactionsPage() {
  return <TransactionsContent />
}
