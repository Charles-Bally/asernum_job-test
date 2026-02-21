import { jwtService } from "@/services/api/jwt.service"
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
