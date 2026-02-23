
import { authMiddleware } from "@/app/api/_helpers/auth.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import { emailService } from "@/services/api/email.service"
import { prisma } from "@/services/api/prisma.service"
import type { AccountAction } from "@prisma/client"
import bcrypt from "bcryptjs"
import type { NextRequest } from "next/server"

type RouteParams = { params: Promise<{ id: string }> }

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

async function logEvent(action: AccountAction, userId: string, performedById: string, description?: string) {
  await prisma.accountEvent.create({
    data: { action, userId, performedById, description },
  })
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  return withMiddleware(authMiddleware, async () => {
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        managedStores: { select: { name: true }, take: 1 },
        supervisedStores: { select: { name: true }, take: 1 },
        cashierAtStores: { select: { name: true }, take: 1 },
      },
    })

    if (!user) return apiError("Utilisateur introuvable", 404)

    const store = user.managedStores[0]?.name
      ?? user.supervisedStores[0]?.name
      ?? user.cashierAtStores[0]?.name
      ?? null

    return apiSuccess({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.isBlocked ? "blocked" : "active",
      store,
      createdAt: formatDate(user.createdAt),
      blockedAt: user.blockedAt ? formatDate(user.blockedAt) : null,
      blockReason: user.blockedReason,
    })
  })(req)
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  return withMiddleware(
    authMiddleware,
    // requireRole("ADMIN"),
    async (_req, context) => {
      const { id } = await params
      const body = await req.json()
      const { action } = body
      const performedById = context.userId!

      const user = await prisma.user.findUnique({ where: { id } })
      if (!user) return apiError("Utilisateur introuvable", 404)

      switch (action) {
        case "block": {
          await prisma.user.update({
            where: { id },
            data: { isBlocked: true, blockedAt: new Date(), blockedReason: body.reason ?? null },
          })
          await logEvent("BLOCKED", id, performedById, body.reason)
          return apiSuccess({ id, status: "blocked", blockedAt: formatDate(new Date()) })
        }
        case "unblock": {
          await prisma.user.update({
            where: { id },
            data: { isBlocked: false, blockedAt: null, blockedReason: null },
          })
          await logEvent("UNBLOCKED", id, performedById)
          return apiSuccess({ id, status: "active", blockedAt: null })
        }
        case "reset-password": {
          const newPassword = generatePassword()
          const hashedPassword = await bcrypt.hash(newPassword, 10)
          await prisma.user.update({ where: { id }, data: { password: hashedPassword } })
          await logEvent("PASSWORD_RESET", id, performedById)
          emailService.sendEmail({
            to: user.email,
            subject: "Réinitialisation de votre mot de passe — Asernum",
            templateName: "admin-reset-password",
            data: {
              firstName: user.firstName,
              lastName: user.lastName,
              password: newPassword,
            },
          }).catch((err) => console.error("[EMAIL] Erreur envoi email reset:", err))

          return apiSuccess({ id, success: true })
        }
        case "change-role": {
          const oldRole = user.role
          await prisma.user.update({ where: { id }, data: { role: body.role } })
          await logEvent("ROLE_CHANGED", id, performedById, `${oldRole} → ${body.role}`)
          return apiSuccess({ id, role: body.role })
        }
        case "update-profile": {
          const changes: string[] = []
          const data: Record<string, string> = {}

          if (body.firstName && body.firstName !== user.firstName) {
            data.firstName = body.firstName
            changes.push(`Prénom: ${user.firstName} → ${body.firstName}`)
          }
          if (body.lastName && body.lastName !== user.lastName) {
            data.lastName = body.lastName
            changes.push(`Nom: ${user.lastName} → ${body.lastName}`)
          }
          if (body.email && body.email !== user.email) {
            const existing = await prisma.user.findUnique({ where: { email: body.email } })
            if (existing) return apiError("Un utilisateur avec cet email existe déjà", 409)
            data.email = body.email
            changes.push(`Email: ${user.email} → ${body.email}`)
          }
          if (body.role && body.role !== user.role) {
            data.role = body.role
            changes.push(`Rôle: ${user.role} → ${body.role}`)
          }

          if (Object.keys(data).length === 0) return apiError("Aucune modification détectée", 400)

          await prisma.user.update({ where: { id }, data })
          await logEvent("PROFILE_UPDATED", id, performedById, changes.join(", "))
          return apiSuccess({ id, ...data })
        }
        default:
          return apiError("Action non reconnue", 400)
      }
    }
  )(req)
}
