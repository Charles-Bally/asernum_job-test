import type { Metadata } from "next"
import { storesService } from "@/services/stores/stores.service"
import { StoreDetailClient } from "./StoreDetailClient"

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params

  try {
    const store = await storesService.getStoreById(id)
    return {
      title: store?.name ? `${store.name} | Auchan Super Admin` : `Magasin ${id} | Auchan Super Admin`,
    }
  } catch {
    return { title: `Magasin ${id} | Auchan Super Admin` }
  }
}

export default async function StoreDetailPage({ params }: Props) {
  const { id } = await params
  return <StoreDetailClient id={id} />
}
