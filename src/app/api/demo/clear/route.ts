import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import { seedAdminUser, wipeDatabase } from "@/services/api/bootstraps/demo-seed.helper"

export async function POST() {
  try {
    await wipeDatabase()
    await seedAdminUser()
    return apiSuccess({ success: true })
  } catch (error) {
    console.error("[Demo Clear] Error:", error)
    return apiError("Erreur lors du nettoyage de la base de données", 500)
  }
}
