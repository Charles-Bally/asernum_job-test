
import { authMiddleware, requireRole } from "@/app/api/_helpers/auth.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import { prisma } from "@/services/api/prisma.service"
import type { NextRequest } from "next/server"

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export const GET = withMiddleware(authMiddleware, requireRole("ADMIN"), async (req: NextRequest) => {
  const id = req.nextUrl.pathname.split("/").pop() || ""

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      store: { select: { name: true, code: true } },
      transactions: {
        select: { amount: true, createdAt: true, type: true },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!client) {
    return apiError("Client introuvable", 404)
  }

  const txCount = client.transactions.length
  const totalPurchases = client.transactions
    .filter((t) => t.type === "PAIEMENT_COURSE")
    .reduce((sum, t) => sum + t.amount, 0)
  const lastTx = client.transactions[0]

  return apiSuccess({
    id: client.id,
    phone: client.phone,
    firstName: client.firstName,
    lastName: client.lastName,
    store: client.store.name,
    storeCode: client.store.code,
    totalPurchases,
    transactionCount: txCount,
    lastVisit: lastTx ? formatDate(lastTx.createdAt) : "N/A",
    status: client.status.toLowerCase() as "active" | "inactive",
  })
})
