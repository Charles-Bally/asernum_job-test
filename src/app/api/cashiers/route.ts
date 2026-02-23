
import { authMiddleware, requireRole } from "@/app/api/_helpers/auth.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiSuccess } from "@/app/api/_helpers/response.helper"
import { prisma } from "@/services/api/prisma.service"
import type { Prisma } from "@prisma/client"
import type { NextRequest } from "next/server"

function formatDateTime(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${day}/${month}/${year}, ${hours}:${minutes}`
}

export const GET = withMiddleware(authMiddleware, requireRole("ADMIN"), async (req: NextRequest) => {
  const params = req.nextUrl.searchParams
  const page = Math.max(1, Number(params.get("page") || "1"))
  const limit = Math.max(1, Number(params.get("limit") || "10"))
  const search = params.get("search") || ""
  const storeId = params.get("storeId") || ""
  const quickFilter = params.get("quickFilter") || ""

  const where: Prisma.UserWhereInput = { role: "CAISSIER" }

  if (storeId) {
    where.cashierAtStores = { some: { code: storeId } }
  }

  if (quickFilter) {
    if (quickFilter.toLowerCase() === "bloqué") where.isBlocked = true
    else if (quickFilter.toLowerCase() === "actif") where.isBlocked = false
  }

  if (search) {
    where.AND = [{
      OR: [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    }]
  }

  const [cashiers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        cashierHistory: {
          orderBy: { assignedAt: "desc" },
          take: 1,
          select: { assignedAt: true },
        },
      },
    }),
    prisma.user.count({ where }),
  ])

  const rows = cashiers.map((c) => ({
    id: c.id,
    username: `${c.firstName}${c.lastName}`.replace(/\s/g, ""),
    accessKey: "****",
    showKey: false,
    assignedDate: c.cashierHistory[0]
      ? formatDateTime(c.cashierHistory[0].assignedAt)
      : formatDateTime(c.createdAt),
    status: c.isBlocked ? "Bloqué" as const : "Actif" as const,
  }))

  const totalPages = Math.ceil(total / limit)

  return apiSuccess({ rows, total, page, totalPages })
})
