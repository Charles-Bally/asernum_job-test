
import { authMiddleware, requireRole } from "@/app/api/_helpers/auth.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import { prisma } from "@/services/api/prisma.service"
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
  const id = req.nextUrl.pathname.split("/").pop() || ""

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      cashierHistory: {
        orderBy: { assignedAt: "desc" },
        take: 1,
        select: { assignedAt: true },
      },
    },
  })

  if (!user || user.role !== "CAISSIER") {
    return apiError("Caissier introuvable", 404)
  }

  return apiSuccess({
    id: user.id,
    username: `${user.firstName}${user.lastName}`.replace(/\s/g, ""),
    accessKey: "****",
    showKey: false,
    assignedDate: user.cashierHistory[0]
      ? formatDateTime(user.cashierHistory[0].assignedAt)
      : formatDateTime(user.createdAt),
    status: user.isBlocked ? "Bloqué" : "Actif",
  })
})
