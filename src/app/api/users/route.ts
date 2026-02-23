
import { authMiddleware, requireRole } from "@/app/api/_helpers/auth.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import { validateBody } from "@/app/api/_helpers/validate.helper"
import { emailService } from "@/services/api/email.service"
import { prisma } from "@/services/api/prisma.service"
import type { AccountAction, Prisma, Role } from "@prisma/client"
import type { NextRequest } from "next/server"

const ROLES: Role[] = ["ADMIN", "MANAGER", "RESPONSABLE_CAISSES", "CAISSIER"]

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

function generateAccessCode(): string {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join("")
}

export const GET = withMiddleware(authMiddleware, requireRole("ADMIN"), async (req: NextRequest) => {
  const params = req.nextUrl.searchParams
  const page = Math.max(1, Number(params.get("page") || "1"))
  const limit = Math.max(1, Number(params.get("limit") || "10"))
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

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        managedStores: { select: { name: true }, take: 1 },
        supervisedStores: { select: { name: true }, take: 1 },
        cashierAtStores: { select: { name: true }, take: 1 },
      },
    }),
    prisma.user.count({ where }),
  ])

  const rows = users.map((u) => {
    const store = u.managedStores[0]?.name
      ?? u.supervisedStores[0]?.name
      ?? u.cashierAtStores[0]?.name
      ?? null

    return {
      id: u.id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      status: u.isBlocked ? "blocked" as const : "active" as const,
      store,
      createdAt: formatDate(u.createdAt),
      blockedAt: u.blockedAt ? formatDate(u.blockedAt) : null,
      blockReason: u.blockedReason,
    }
  })

  const totalPages = Math.ceil(total / limit)

  return apiSuccess({ rows, total, page, totalPages, roles: ROLES })
})

export const POST = withMiddleware(
  authMiddleware,
  requireRole("ADMIN"),
  validateBody({
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string" },
    role: { type: "string" },
  }),
  async (_req, context) => {
    const body = context.body!

    const existing = await prisma.user.findUnique({ where: { email: body.email } })
    if (existing) return apiError("Un utilisateur avec cet email existe déjà", 409)

    const password = generatePassword()
    const isAdmin = body.role === "ADMIN"
    const accessCode = isAdmin ? null : generateAccessCode()

    const user = await prisma.user.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password,
        role: body.role as Role,
        accessKey: accessCode,
      },
    })

    await prisma.accountEvent.create({
      data: {
        action: "CREATED" as AccountAction,
        userId: user.id,
        performedById: context.userId!,
        description: `Compte ${body.role} créé`,
      },
    })

    console.log(`[DEV] New password for ${body.email}: ${password}`)
    if (accessCode) console.log(`[DEV] Access code for ${body.email}: ${accessCode}`)

    const ROLE_LABELS: Record<string, string> = {
      ADMIN: "Administrateur",
      MANAGER: "Manager",
      RESPONSABLE_CAISSES: "Responsable Caisses",
      CAISSIER: "Caissier",
    }

    emailService.sendEmail({
      to: body.email,
      subject: "Bienvenue sur Asernum — Vos identifiants de connexion",
      templateName: "new-user-password",
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        role: ROLE_LABELS[body.role] ?? body.role,
        email: body.email,
        password,
        accessCode,
      },
    }).catch((err) => console.error("[EMAIL] Erreur envoi email new-user:", err))

    return apiSuccess({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: "active",
        store: null,
        createdAt: formatDate(user.createdAt),
        blockedAt: null,
        blockReason: null,
      },
      hasAccessCode: !isAdmin,
      success: true,
    }, 201)
  }
)
