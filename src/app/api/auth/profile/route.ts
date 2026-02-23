import { authMiddleware } from "@/app/api/_helpers/auth.helper"
import type { ApiContext } from "@/app/api/_helpers/middleware.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import { prisma } from "@/services/api/prisma.service"
import { NextRequest } from "next/server"

async function getHandler(_req: NextRequest, context: ApiContext) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: context.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isBlocked: true,
        createdAt: true,
        cashierAtStores: { select: { name: true } },
        managedStores: { select: { name: true } },
        supervisedStores: { select: { name: true } },
      },
    })

    if (!user) {
      return apiError("Utilisateur introuvable", 404)
    }

    if (user.isBlocked) {
      return apiError("Votre compte a été bloqué. Veuillez contacter un administrateur.", 403)
    }

    return apiSuccess({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt.toISOString(),
      store:
        user.cashierAtStores[0]?.name ??
        user.managedStores[0]?.name ??
        user.supervisedStores[0]?.name ??
        null,
    })
  } catch (error) {
    console.error("Erreur profil GET:", error)
    return apiError("Erreur lors de la récupération du profil", 500)
  }
}

async function patchHandler(req: NextRequest, context: ApiContext) {
  try {
    const body = await req.json()
    const { firstName, lastName } = body

    if (!firstName?.trim() || !lastName?.trim()) {
      return apiError("Le prénom et le nom sont requis", 400)
    }

    const user = await prisma.user.update({
      where: { id: context.userId },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    })

    return apiSuccess(user)
  } catch (error) {
    console.error("Erreur profil PATCH:", error)
    return apiError("Erreur lors de la mise à jour du profil", 500)
  }
}

export const GET = withMiddleware(authMiddleware, getHandler)
export const PATCH = withMiddleware(authMiddleware, patchHandler)
