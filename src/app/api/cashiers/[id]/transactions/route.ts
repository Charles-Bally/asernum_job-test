import { authMiddleware, requireRole } from "@/app/api/_helpers/auth.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import { prisma } from "@/services/api/prisma.service"
import type { Prisma } from "@prisma/client"
import type { NextRequest } from "next/server"

function formatDateTime(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0")
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const y = date.getFullYear()
  const h = String(date.getHours()).padStart(2, "0")
  const min = String(date.getMinutes()).padStart(2, "0")
  return `${d}/${m}/${y}, ${h}:${min}`
}

function formatAmount(amount: number): string {
  const abs = Math.abs(amount).toLocaleString("fr-FR")
  return amount >= 0 ? `+${abs} FCFA` : `-${abs} FCFA`
}

export const GET = withMiddleware(authMiddleware, requireRole("ADMIN"), async (req: NextRequest) => {
  const segments = req.nextUrl.pathname.split("/")
  const txIdx = segments.indexOf("transactions")
  const cashierId = segments[txIdx - 1] || ""

  const params = req.nextUrl.searchParams
  const page = Math.max(1, Number(params.get("page") || "1"))
  const limit = Math.max(1, Number(params.get("limit") || "15"))
  const storeCode = params.get("storeCode") || ""

  const user = await prisma.user.findUnique({ where: { id: cashierId }, select: { role: true } })
  if (!user || user.role !== "CAISSIER") return apiError("Caissier introuvable", 404)

  const where: Prisma.TransactionWhereInput = { cashierId }
  if (storeCode) where.store = { code: storeCode }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        store: { select: { name: true } },
        client: { select: { firstName: true, lastName: true } },
      },
    }),
    prisma.transaction.count({ where }),
  ])

  const rows = transactions.map((tx) => {
    const label = tx.type === "PAIEMENT_COURSE" ? "Paiement course" : "Rendu monnaie"
    const signed = tx.type === "PAIEMENT_COURSE" ? tx.amount : -tx.amount
    return {
      id: tx.id,
      type: label,
      amount: formatAmount(signed),
      store: tx.store.name,
      client: tx.client ? `${tx.client.firstName} ${tx.client.lastName}` : null,
      date: formatDateTime(tx.createdAt),
    }
  })

  return apiSuccess({ rows, total, page, totalPages: Math.ceil(total / limit) })
})
