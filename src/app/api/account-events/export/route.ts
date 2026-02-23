import { authMiddleware, requireRole } from "@/app/api/_helpers/auth.helper"
import { csvResponse, toCsv } from "@/app/api/_helpers/csv.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { prisma } from "@/services/api/prisma.service"
import type { AccountAction, Prisma } from "@prisma/client"
import type { NextRequest } from "next/server"

const ACTION_LABELS: Record<string, string> = {
  CREATED: "Création de compte",
  BLOCKED: "Blocage",
  UNBLOCKED: "Déblocage",
  PASSWORD_RESET: "Réinitialisation mot de passe",
  ROLE_CHANGED: "Changement de rôle",
  ASSIGNED_STORE: "Assignation magasin",
  PROFILE_UPDATED: "Mise à jour du profil",
}

function normalize(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
}

function matchingActions(search: string): string[] {
  const term = normalize(search)
  return Object.entries(ACTION_LABELS)
    .filter(([, label]) => normalize(label).includes(term))
    .map(([key]) => key)
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export const GET = withMiddleware(authMiddleware, requireRole("ADMIN"), async (req: NextRequest) => {
  const params = req.nextUrl.searchParams
  const search = params.get("search") || ""
  const action = params.get("action") || ""
  const quickFilter = params.get("quickFilter") || ""

  const where: Prisma.AccountEventWhereInput = {}

  const actionFilter = action || quickFilter
  if (actionFilter) {
    where.action = actionFilter as Prisma.EnumAccountActionFilter
  }

  if (search) {
    const actions = matchingActions(search)
    const orConditions: Prisma.AccountEventWhereInput[] = [
      { user: { firstName: { contains: search, mode: "insensitive" } } },
      { user: { lastName: { contains: search, mode: "insensitive" } } },
      { performedBy: { firstName: { contains: search, mode: "insensitive" } } },
      { performedBy: { lastName: { contains: search, mode: "insensitive" } } },
      { description: { contains: search, mode: "insensitive" } },
      { reason: { contains: search, mode: "insensitive" } },
    ]
    for (const a of actions) {
      orConditions.push({ action: { equals: a as AccountAction } })
    }
    where.OR = orConditions
  }

  const events = await prisma.accountEvent.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { firstName: true, lastName: true } },
      performedBy: { select: { firstName: true, lastName: true } },
    },
  })

  const rows = events.map((e) => ({
    userName: `${e.user.firstName} ${e.user.lastName}`,
    action: ACTION_LABELS[e.action] ?? e.action,
    description: e.description ?? e.reason ?? "",
    performedBy: `${e.performedBy.firstName} ${e.performedBy.lastName}`,
    createdAt: formatDate(e.createdAt),
  }))

  const csv = toCsv(rows, [
    { header: "Utilisateur", key: "userName" },
    { header: "Action", key: "action" },
    { header: "Description", key: "description" },
    { header: "Par", key: "performedBy" },
    { header: "Date", key: "createdAt" },
  ])

  return csvResponse(csv, "historique.csv")
})
