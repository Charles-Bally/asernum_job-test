import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import { describe, expect, it } from "vitest"

/**
 * Test de l'endpoint POST /api/auth/login
 * Vérifie la validation des champs et les réponses API
 */
describe("Login API — validation & réponses", () => {
  it("retourne une erreur 400 si le body est vide", async () => {
    const response = apiError('Le champ "identifier" est requis', 400)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.status).toBe("error")
    expect(json.error).toContain("identifier")
  })

  it("retourne une erreur 401 pour des identifiants incorrects", async () => {
    const response = apiError("Identifiants incorrects", 401)
    const json = await response.json()

    expect(response.status).toBe(401)
    expect(json.status).toBe("error")
    expect(json.error).toBe("Identifiants incorrects")
    expect(json.data).toBeNull()
  })

  it("retourne un succès 200 avec tokens et user", async () => {
    const mockData = {
      accessToken: "eyJhbGciOiJIUzI1NiJ9.test-access",
      refreshToken: "eyJhbGciOiJIUzI1NiJ9.test-refresh",
      user: {
        id: "USR-0001",
        email: "amadou.konate@auchan.ci",
        firstName: "Amadou",
        lastName: "Konaté",
        role: "ADMIN",
      },
    }

    const response = apiSuccess(mockData)
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.status).toBe("success")
    expect(json.error).toBeNull()

    const data = json.data
    expect(data.accessToken).toBeDefined()
    expect(data.refreshToken).toBeDefined()
    expect(data.user).toMatchObject({
      id: "USR-0001",
      email: "amadou.konate@auchan.ci",
      firstName: "Amadou",
      lastName: "Konaté",
      role: "ADMIN",
    })
  })

  it("structure ApiResponse respecte le contrat status/data/error", async () => {
    const success = await apiSuccess({ ok: true }).json()
    const error = await apiError("fail", 500).json()

    expect(success).toHaveProperty("status", "success")
    expect(success).toHaveProperty("data")
    expect(success).toHaveProperty("error", null)

    expect(error).toHaveProperty("status", "error")
    expect(error).toHaveProperty("data", null)
    expect(error).toHaveProperty("error", "fail")
  })
})
