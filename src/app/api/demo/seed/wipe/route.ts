import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import { wipeDatabase, seedAdminUser } from "@/services/api/bootstraps/demo-seed-wipe"

export const maxDuration = 60

export async function POST() {
  try {
    console.log("[Seed:Wipe] Wiping database...")
    await wipeDatabase()
    const admin = await seedAdminUser()
    console.log("[Seed:Wipe] Done, adminId:", admin.id)
    return apiSuccess({ adminId: admin.id })
  } catch (error) {
    console.error("[Seed:Wipe] Error:", error)
    const msg = error instanceof Error ? error.message : "Erreur inconnue"
    return apiError(`Erreur wipe: ${msg}`, 500)
  }
}
