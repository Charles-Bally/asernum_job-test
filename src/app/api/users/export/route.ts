import { authMiddleware, requireRole } from "@/app/api/_helpers/auth.helper"
import { csvResponse, toCsv } from "@/app/api/_helpers/csv.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { prisma } from "@/services/api/prisma.service"
import type { Prisma, Role } from "@prisma/client"
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
  const role = params.get("role") || ""
  const status = params.get("status") || ""

  const where: Prisma.UserWhereInput = {}

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ]
  }

  if (role) where.role = role as Role
  if (status === "blocked") where.isBlocked = true
  else if (status === "active") where.isBlocked = false

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      managedStores: { select: { name: true }, take: 1 },
      supervisedStores: { select: { name: true }, take: 1 },
      cashierAtStores: { select: { name: true }, take: 1 },
    },
  })

  const rows = users.map((u) => ({
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    role: u.role,
    store: u.managedStores[0]?.name ?? u.supervisedStores[0]?.name ?? u.cashierAtStores[0]?.name ?? "",
    status: u.isBlocked ? "Bloqué" : "Actif",
    createdAt: formatDate(u.createdAt),
  }))

  const csv = toCsv(rows, [
    { header: "Prénom", key: "firstName" },
    { header: "Nom", key: "lastName" },
    { header: "Email", key: "email" },
    { header: "Rôle", key: "role" },
    { header: "Magasin", key: "store" },
    { header: "Statut", key: "status" },
    { header: "Date de création", key: "createdAt" },
  ])

  return csvResponse(csv, "utilisateurs.csv")
})
