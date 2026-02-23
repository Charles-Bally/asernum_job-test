import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import { wipeDatabase, seedAdminUser } from "@/services/api/bootstraps/demo-seed-wipe"

export const maxDuration = 60

export async function POST() {
  try {
    await wipeDatabase()
    const admin = await seedAdminUser()
    return apiSuccess({ adminId: admin.id })
  } catch (error) {
    console.error("[Seed:Wipe] Error:", error)
    const msg = error instanceof Error ? error.message : "Erreur inconnue"
    return apiError(`Erreur wipe: ${msg}`, 500)
  }
}
