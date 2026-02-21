import { NextRequest, NextResponse } from "next/server"
import { jwtService } from "@/services/api/jwt.service"
import { apiError } from "./response.helper"
import type { ApiContext } from "./middleware.helper"

export async function authMiddleware(
  req: NextRequest,
  context: ApiContext
): Promise<NextResponse | void> {
  const authorization = req.headers.get("Authorization")

  if (!authorization?.startsWith("Bearer ")) {
    return apiError("Token manquant", 401)
  }

  const token = authorization.slice(7)
  const payload = jwtService.verifyAccessToken(token)

  if (!payload) {
    return apiError("Token invalide ou expiré", 401)
  }

  context.userId = payload.userId
}
