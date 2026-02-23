import { authMiddleware, requireRole } from "@/app/api/_helpers/auth.helper"
import { csvResponse, toCsv } from "@/app/api/_helpers/csv.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
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

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      store: { select: { name: true } },
      client: { select: { phone: true } },
    },
  })

  const rows = transactions.map((t) => ({
    type: TYPE_LABELS[t.type] ?? t.type,
    store: t.store.name,
    amount: t.type === "RENDU_MONNAIE" ? -t.amount : t.amount,
    client: t.client?.phone ?? "",
    date: formatDate(t.createdAt),
  }))

  const csv = toCsv(rows, [
    { header: "Type", key: "type" },
    { header: "Magasin", key: "store" },
    { header: "Montant", key: (r) => String(r.amount) },
    { header: "Client", key: "client" },
    { header: "Date", key: "date" },
  ])

  return csvResponse(csv, "transactions.csv")
})
