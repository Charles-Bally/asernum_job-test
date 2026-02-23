import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import { seedAllUsers } from "@/services/api/bootstraps/demo-seed-users"

export const maxDuration = 300

export async function POST() {
  try {
    const { managers, rcs, cashiers } = await seedAllUsers()
    return apiSuccess({ managers, rcs, cashiers })
  } catch (error) {
    console.error("[Seed:Users] Error:", error)
    const msg = error instanceof Error ? error.message : "Erreur inconnue"
    return apiError(`Erreur users: ${msg}`, 500)
  }
}
