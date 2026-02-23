
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
      manager: { select: { id: true, firstName: true, lastName: true } },
      responsableCaisses: { select: { id: true, firstName: true, lastName: true } },
      cashiers: { select: { id: true, firstName: true, lastName: true } },
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
    ville: store.ville,
    commune: store.commune,
    quartier: store.quartier ?? "",
    manager: `${store.manager.lastName} ${store.manager.firstName}`,
    managerId: store.manager.id,
    responsableCaisse: `${store.responsableCaisses.lastName} ${store.responsableCaisses.firstName}`,
    responsableCaissesId: store.responsableCaisses.id,
    cashierIds: store.cashiers.map((c) => c.id),
    nbCaissiers: store._count.cashiers,
    nbTransactions: store._count.transactions,
    stats,
  })
})

export const PATCH = withMiddleware(authMiddleware, requireRole("ADMIN"), async (req: NextRequest) => {
  const code = req.nextUrl.pathname.split("/").pop() || ""
  const body = await req.json()

  const store = await prisma.store.findUnique({ where: { code } })
  if (!store) {
    return apiError("Magasin introuvable", 404)
  }

  if (body.managerId) {
    const managerExists = await prisma.user.findUnique({ where: { id: body.managerId } })
    if (!managerExists) return apiError("Manager introuvable", 404)
  }

  if (body.responsableCaissesId) {
    const rcExists = await prisma.user.findUnique({ where: { id: body.responsableCaissesId } })
    if (!rcExists) return apiError("Responsable caisses introuvable", 404)
  }

  const updateData: Record<string, unknown> = {}
  if (body.name !== undefined) updateData.name = body.name
  if (body.ville !== undefined) updateData.ville = body.ville
  if (body.commune !== undefined) updateData.commune = body.commune
  if (body.quartier !== undefined) updateData.quartier = body.quartier || null
  if (body.managerId !== undefined) updateData.managerId = body.managerId
  if (body.responsableCaissesId !== undefined) updateData.responsableCaissesId = body.responsableCaissesId

  if (Array.isArray(body.cashierIds)) {
    updateData.cashiers = {
      set: body.cashierIds.map((id: string) => ({ id })),
    }
  }

  const updated = await prisma.store.update({
    where: { code },
    data: updateData,
    include: {
      manager: { select: { firstName: true, lastName: true } },
      responsableCaisses: { select: { firstName: true, lastName: true } },
    },
  })

  return apiSuccess({ store: updated, success: true })
})
