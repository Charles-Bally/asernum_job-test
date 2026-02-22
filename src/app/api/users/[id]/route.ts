import { randomDelay } from "@/app/api/_helpers/delay.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import type { NextRequest } from "next/server"

type RouteParams = { params: Promise<{ id: string }> }

function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  return withMiddleware(async () => {
    await randomDelay()
    const { id } = await params

    return apiSuccess({
      id,
      firstName: "Amadou",
      lastName: "Konaté",
      email: "amadou.konate@auchan.ci",
      role: "MANAGER",
      status: "active",
      store: "Angré Djibi 1",
      createdAt: "01/03/2024",
      blockedAt: null,
      blockReason: null,
    })
  })(req)
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  return withMiddleware(async () => {
    await randomDelay()
    const { id } = await params
    const body = await req.json()
    const { action } = body

    switch (action) {
      case "block":
        return apiSuccess({ id, status: "blocked", blockedAt: new Date().toLocaleDateString("fr-FR") })
      case "unblock":
        return apiSuccess({ id, status: "active", blockedAt: null })
      case "reset-password": {
        const newPassword = generatePassword()
        console.log(`[DEV] Mock email — New password for user ${id}: ${newPassword}`)
        return apiSuccess({ id, success: true })
      }
      case "change-role":
        return apiSuccess({ id, role: body.role })
      default:
        return apiError("Action non reconnue", 400)
    }
  })(req)
}
