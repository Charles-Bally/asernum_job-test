import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import { runFullSeed } from "@/services/api/bootstraps/demo-seed.helper"

export const maxDuration = 120

export async function POST() {
  try {
    console.log("[Demo Seed] Starting full seed...")
    const result = await runFullSeed()
    console.log("[Demo Seed] Done:", result)
    return apiSuccess({ success: true, ...result })
  } catch (error) {
    console.error("[Demo Seed] Error:", error)
    const msg = error instanceof Error ? error.message : "Erreur inconnue"
    return apiError(`Erreur seed: ${msg}`, 500)
  }
}
