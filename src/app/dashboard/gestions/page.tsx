import { GestionContent } from "@/components/dashboard/gestion/GestionContent"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gestions | Auchan Super Admin",
}

export default function GestionsPage() {
  return <GestionContent />
}
