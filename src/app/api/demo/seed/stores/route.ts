import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import { seedStores } from "@/services/api/bootstraps/demo-seed-stores"
import type { Uid } from "@/services/api/bootstraps/demo-seed-utils"

export const maxDuration = 300

interface StoresBody {
  managers: Uid[]
  rcs: Uid[]
  cashiers: Uid[]
}

export async function POST(req: Request) {
  try {
    const { managers, rcs, cashiers } = (await req.json()) as StoresBody
    const stores = await seedStores(managers, rcs, cashiers)
    return apiSuccess({ stores })
  } catch (error) {
    console.error("[Seed:Stores] Error:", error)
    const msg = error instanceof Error ? error.message : "Erreur inconnue"
    return apiError(`Erreur stores: ${msg}`, 500)
  }
}
