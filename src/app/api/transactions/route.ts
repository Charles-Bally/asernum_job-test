
import { authMiddleware, requireRole } from "@/app/api/_helpers/auth.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiSuccess } from "@/app/api/_helpers/response.helper"
import { prisma } from "@/services/api/prisma.service"
import type { Prisma } from "@prisma/client"
import type { NextRequest } from "next/server"

const TYPE_LABELS: Record<string, string> = {
  PAIEMENT_COURSE: "Paiement course",
  RENDU_MONNAIE: "Rendu monnaie",
}

const LABEL_TO_ENUM: Record<string, string> = {
  "paiement course": "PAIEMENT_COURSE",
  "rendu monnaie": "RENDU_MONNAIE",
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${day}/${month}/${year}, ${hours}:${minutes}`
}

function parseDateParam(param: string): Date {
  const [day, month, year] = param.split("/")
  return new Date(Number(year), Number(month) - 1, Number(day))
}

export const GET = withMiddleware(authMiddleware, requireRole("ADMIN"), async (req: NextRequest) => {
  const params = req.nextUrl.searchParams
  const page = Math.max(1, Number(params.get("page") || "1"))
  const limit = Math.max(1, Number(params.get("limit") || "10"))
  const search = params.get("search") || ""
  const storeId = params.get("storeId") || ""
  const quickFilter = params.get("quickFilter") || ""
  const dateFrom = params.get("dateFrom") || ""
  const dateTo = params.get("dateTo") || ""

  const where: Prisma.TransactionWhereInput = {}

  if (storeId) {
    where.store = { code: storeId }
  }

  if (quickFilter) {
    const enumVal = LABEL_TO_ENUM[quickFilter.toLowerCase()]
    if (enumVal) {
      where.type = enumVal as Prisma.EnumTransactionTypeFilter
    }
  }

  if (dateFrom && dateTo) {
    const from = parseDateParam(dateFrom)
    const to = parseDateParam(dateTo)
    to.setHours(23, 59, 59, 999)
    where.createdAt = { gte: from, lte: to }
  }

  if (search) {
    const searchConditions: Prisma.TransactionWhereInput[] = [
      { id: { contains: search, mode: "insensitive" } },
      { store: { name: { contains: search, mode: "insensitive" } } },
    ]
    const enumVal = LABEL_TO_ENUM[search.toLowerCase()]
    if (enumVal) {
      searchConditions.push({ type: enumVal as Prisma.EnumTransactionTypeFilter })
    }
    where.AND = [{ OR: searchConditions }]
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        store: { select: { name: true, code: true } },
        client: { select: { phone: true } },
      },
    }),
    prisma.transaction.count({ where }),
  ])

  const rows = transactions.map((t) => ({
    id: t.id,
    type: TYPE_LABELS[t.type] ?? t.type,
    store: t.store.name,
    storeCode: t.store.code,
    amount: t.type === "RENDU_MONNAIE" ? -t.amount : t.amount,
    client: t.client?.phone ?? null,
    date: formatDate(t.createdAt),
  }))

  const totalPages = Math.ceil(total / limit)

  return apiSuccess({ rows, total, page, totalPages })
})
