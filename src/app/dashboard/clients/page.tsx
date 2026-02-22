import { ClientsContent } from "@/components/dashboard/clients/ClientsContent"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Clients | Auchan Super Admin",
}

export default function ClientsPage() {
  return <ClientsContent />
}
