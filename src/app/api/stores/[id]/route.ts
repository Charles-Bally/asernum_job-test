
import { authMiddleware, requireRole } from "@/app/api/_helpers/auth.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import { prisma } from "@/services/api/prisma.service"
import type { NextRequest } from "next/server"

export const GET = withMiddleware(authMiddleware, requireRole("ADMIN"), async (req: NextRequest) => {
  const id = req.nextUrl.pathname.split("/").pop() || ""

  const store = await prisma.store.findUnique({
    where: { code: id },
    include: {
      manager: { select: { firstName: true, lastName: true } },
      responsableCaisses: { select: { firstName: true, lastName: true } },
      _count: { select: { cashiers: true, transactions: true } },
    },
  })

  if (!store) {
    return apiError("Magasin introuvable", 404)
  }

  const [renduMonnaie, paiementCourse] = await Promise.all([
    prisma.transaction.count({
      where: { storeId: store.id, type: "RENDU_MONNAIE" },
    }),
    prisma.transaction.count({
      where: { storeId: store.id, type: "PAIEMENT_COURSE" },
    }),
  ])

  const totalTx = renduMonnaie + paiementCourse
  const stats = totalTx > 0
    ? {
        renduMonnaie: Math.round((renduMonnaie / totalTx) * 100),
        paiementCourse: Math.round((paiementCourse / totalTx) * 100),
      }
    : { renduMonnaie: 0, paiementCourse: 0 }

  return apiSuccess({
    id: store.id,
    name: store.name,
    code: store.code,
    city: `${store.ville}, ${store.commune}`,
    manager: `${store.manager.lastName} ${store.manager.firstName}`,
    responsableCaisse: `${store.responsableCaisses.lastName} ${store.responsableCaisses.firstName}`,
    nbCaissiers: store._count.cashiers,
    nbTransactions: store._count.transactions,
    stats,
  })
})
