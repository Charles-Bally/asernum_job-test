
import { authMiddleware, requireRole } from "@/app/api/_helpers/auth.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiSuccess } from "@/app/api/_helpers/response.helper"
import { prisma } from "@/services/api/prisma.service"

export const GET = withMiddleware(authMiddleware, requireRole("ADMIN"), async () => {
  const [result, expenseResult] = await Promise.all([
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: "PAIEMENT_COURSE" },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: "RENDU_MONNAIE" },
    }),
  ])

  const income = result._sum.amount ?? 0

  const expense = expenseResult._sum.amount ?? 0

  return apiSuccess({ balance: income - expense })
})
