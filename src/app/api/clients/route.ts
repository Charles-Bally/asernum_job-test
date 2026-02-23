
import { authMiddleware, requireRole } from "@/app/api/_helpers/auth.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiSuccess } from "@/app/api/_helpers/response.helper"
import { prisma } from "@/services/api/prisma.service"
import type { Prisma } from "@prisma/client"
import type { NextRequest } from "next/server"

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export const GET = withMiddleware(authMiddleware, requireRole("ADMIN"), async (req: NextRequest) => {
  const params = req.nextUrl.searchParams
  const page = Math.max(1, Number(params.get("page") || "1"))
  const limit = Math.max(1, Number(params.get("limit") || "10"))
  const search = params.get("search") || ""
  const quickFilter = params.get("quickFilter") || ""
  const status = params.get("status") || ""

  const where: Prisma.ClientWhereInput = {}

  if (quickFilter) {
    where.store = { code: quickFilter }
  }

  if (status) {
    where.status = status === "active" ? "ACTIVE" : "INACTIVE"
  }

  if (search) {
    where.OR = [
      { phone: { contains: search, mode: "insensitive" } },
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { store: { name: { contains: search, mode: "insensitive" } } },
    ]
  }

  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        store: { select: { name: true, code: true } },
        transactions: {
          select: { amount: true, createdAt: true, type: true },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.client.count({ where }),
  ])

  const rows = clients.map((c) => {
    const txCount = c.transactions.length
    const totalPurchases = c.transactions
      .filter((t) => t.type === "PAIEMENT_COURSE")
      .reduce((sum, t) => sum + t.amount, 0)
    const lastTx = c.transactions[0]

    return {
      id: c.id,
      phone: c.phone,
      firstName: c.firstName,
      lastName: c.lastName,
      store: c.store.name,
      storeCode: c.store.code,
      totalPurchases,
      transactionCount: txCount,
      lastVisit: lastTx ? formatDate(lastTx.createdAt) : "N/A",
      status: c.status.toLowerCase() as "active" | "inactive",
    }
  })

  const totalPages = Math.ceil(total / limit)

  return apiSuccess({ rows, total, page, totalPages })
})
