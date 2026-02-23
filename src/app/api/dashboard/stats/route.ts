
import { authMiddleware, requireRole } from "@/app/api/_helpers/auth.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiSuccess } from "@/app/api/_helpers/response.helper"
import { prisma } from "@/services/api/prisma.service"
import type { NextRequest } from "next/server"

function getPeriodStart(period: string): Date {
  const now = new Date()

  switch (period) {
    case "today": {
      const start = new Date(now)
      start.setHours(0, 0, 0, 0)
      return start
    }
    case "7days":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case "30days":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    case "year": {
      const start = new Date(now.getFullYear(), 0, 1)
      return start
    }
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }
}

export const GET = withMiddleware(authMiddleware, requireRole("ADMIN"), async (req: NextRequest) => {
  const period = req.nextUrl.searchParams.get("period") || "30days"
  const periodStart = getPeriodStart(period)

  const [renduMonnaie, paiementCourse] = await Promise.all([
    prisma.transaction.count({
      where: { type: "RENDU_MONNAIE", createdAt: { gte: periodStart } },
    }),
    prisma.transaction.count({
      where: { type: "PAIEMENT_COURSE", createdAt: { gte: periodStart } },
    }),
  ])

  return apiSuccess({ renduMonnaie, paiementCourse })
})
