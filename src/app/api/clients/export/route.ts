import { authMiddleware, requireRole } from "@/app/api/_helpers/auth.helper"
import { csvResponse, toCsv } from "@/app/api/_helpers/csv.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
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

  const clients = await prisma.client.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      store: { select: { name: true } },
      transactions: {
        select: { amount: true, createdAt: true, type: true },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  const rows = clients.map((c) => {
    const purchaseCount = c.transactions.filter((t) => t.type === "PAIEMENT_COURSE").length
    const txCount = c.transactions.length
    const lastTx = c.transactions[0]

    return {
      phone: c.phone,
      firstName: c.firstName,
      lastName: c.lastName,
      store: c.store.name,
      purchaseCount: String(purchaseCount),
      transactionCount: String(txCount),
      lastVisit: lastTx ? formatDate(lastTx.createdAt) : "N/A",
      status: c.status === "ACTIVE" ? "Actif" : "Inactif",
    }
  })

  const csv = toCsv(rows, [
    { header: "Téléphone", key: "phone" },
    { header: "Prénom", key: "firstName" },
    { header: "Nom", key: "lastName" },
    { header: "Magasin", key: "store" },
    { header: "Nb achats", key: "purchaseCount" },
    { header: "Nb transactions", key: "transactionCount" },
    { header: "Dernière visite", key: "lastVisit" },
    { header: "Statut", key: "status" },
  ])

  return csvResponse(csv, "clients.csv")
})
