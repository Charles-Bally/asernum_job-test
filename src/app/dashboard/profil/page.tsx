import { ProfilContent } from "@/components/dashboard/profil/ProfilContent"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mon profil | Auchan Super Admin",
}

export default function ProfilPage() {
  return <ProfilContent />
}
