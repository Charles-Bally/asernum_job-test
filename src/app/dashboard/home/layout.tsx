import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tableau de bord | Auchan Super Admin",
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return children
}
