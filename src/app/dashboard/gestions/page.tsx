import type { Metadata } from "next"
import { GestionContent } from "@/components/dashboard/gestion/GestionContent"

export const metadata: Metadata = {
  title: "Gestions | Asernum",
}

export default function GestionsPage() {
  return <GestionContent />
}
