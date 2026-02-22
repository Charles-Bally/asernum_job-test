import type { Metadata } from "next"
import { ClientsContent } from "@/components/dashboard/clients/ClientsContent"

export const metadata: Metadata = {
  title: "Clients | Asernum",
}

export default function ClientsPage() {
  return <ClientsContent />
}
