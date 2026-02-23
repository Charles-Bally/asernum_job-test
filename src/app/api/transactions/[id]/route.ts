
import { authMiddleware, requireRole } from "@/app/api/_helpers/auth.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import { prisma } from "@/services/api/prisma.service"
import type { NextRequest } from "next/server"

const TYPE_LABELS: Record<string, string> = {
  PAIEMENT_COURSE: "Paiement course",
  RENDU_MONNAIE: "Rendu monnaie",
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${day}/${month}/${year}, ${hours}:${minutes}`
}

export const GET = withMiddleware(authMiddleware, requireRole("ADMIN"), async (req: NextRequest) => {
  const id = req.nextUrl.pathname.split("/").pop() || ""

  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: {
      store: { select: { name: true, code: true } },
      client: { select: { phone: true } },
    },
  })

  if (!transaction) {
    return apiError("Transaction introuvable", 404)
  }

  return apiSuccess({
    id: transaction.id,
    type: TYPE_LABELS[transaction.type] ?? transaction.type,
    store: transaction.store.name,
    storeCode: transaction.store.code,
    amount: transaction.type === "RENDU_MONNAIE" ? -transaction.amount : transaction.amount,
    client: transaction.client?.phone ?? null,
    date: formatDate(transaction.createdAt),
  })
})
