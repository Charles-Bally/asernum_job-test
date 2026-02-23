import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import { runFullSeed } from "@/services/api/bootstraps/demo-seed.helper"

export const maxDuration = 120

export async function POST() {
  try {
    const result = await runFullSeed()
    return apiSuccess({ success: true, ...result })
  } catch (error) {
    console.error("[Demo Seed] Error:", error)
    const msg = error instanceof Error ? error.message : "Erreur inconnue"
    return apiError(`Erreur seed: ${msg}`, 500)
  }
}
