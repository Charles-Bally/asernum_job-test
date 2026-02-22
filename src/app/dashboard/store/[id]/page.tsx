import type { Metadata } from "next"
import { StoreDetailClient } from "./StoreDetailClient"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return { title: `Détails magasin ${id} | Auchan Super Admin` }
}

export default async function StoreDetailPage({ params }: Props) {
  const { id } = await params
  return <StoreDetailClient id={id} />
}
