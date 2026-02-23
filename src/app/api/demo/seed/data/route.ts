import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import { seedStoreData, seedEvents } from "@/services/api/bootstraps/demo-seed-data"
import type { StoreWithCashiers, Uid } from "@/services/api/bootstraps/demo-seed-utils"

export const maxDuration = 300

interface DataBody {
  adminId: string
  stores: StoreWithCashiers[]
  managers: Uid[]
  rcs: Uid[]
  cashiers: Uid[]
}

export async function POST(req: Request) {
  try {
    const { adminId, stores, managers, rcs, cashiers } = (await req.json()) as DataBody
    const { totalClients, totalTx } = await seedStoreData(stores, adminId)
    await seedEvents(adminId, managers, rcs, cashiers)
    return apiSuccess({ totalClients, totalTx })
  } catch (error) {
    console.error("[Seed:Data] Error:", error)
    const msg = error instanceof Error ? error.message : "Erreur inconnue"
    return apiError(`Erreur data: ${msg}`, 500)
  }
}
