import { ProfilContent } from "@/components/dashboard/profil/ProfilContent"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mon profil | Asernum",
}

export default function ProfilPage() {
  return <ProfilContent />
}
