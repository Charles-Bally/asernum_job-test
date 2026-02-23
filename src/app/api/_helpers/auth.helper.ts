import { jwtService } from "@/services/api/jwt.service"
import { prisma } from "@/services/api/prisma.service"
import type { Role } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import type { ApiContext } from "./middleware.helper"
import { apiError } from "./response.helper"

export async function authMiddleware(
  req: NextRequest,
  context: ApiContext
): Promise<NextResponse | void> {
  const authorization = req.headers.get("Authorization")

  if (!authorization) {
    return apiError("Token manquant", 401)
  }
  const [type, token] = authorization.split(' ');
  if (type !== "Bearer") {
    return apiError("Type de token invalide", 401)
  }
  if (!token) {
    return apiError("Token manquant", 401)
  }

  const payload = jwtService.verifyAccessToken(token)

  if (!payload) {
    return apiError("Token invalide ou expiré", 401)
  }

  context.userId = payload.userId
}

export function requireRole(...roles: Role[]) {
  return async (_req: NextRequest, context: ApiContext): Promise<NextResponse | void> => {
    const user = await prisma.user.findUnique({
      where: { id: context.userId },
      select: { role: true, isBlocked: true },
    })

    if (!user) return apiError("Utilisateur introuvable", 404)
    if (user.isBlocked) return apiError("Votre compte a été bloqué.", 403)
    if (!roles.includes(user.role)) {
      return apiError("Vous n'avez pas les droits pour effectuer cette action.", 403)
    }

    context.userRole = user.role
  }
}
