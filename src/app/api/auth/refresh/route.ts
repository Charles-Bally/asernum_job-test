import { NextRequest } from "next/server"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { validateBody } from "@/app/api/_helpers/validate.helper"
import { apiSuccess, apiError } from "@/app/api/_helpers/response.helper"
import { jwtService } from "@/services/api/jwt.service"
import type { ApiContext } from "@/app/api/_helpers/middleware.helper"

async function handler(_req: NextRequest, context: ApiContext) {
  const { refreshToken } = context.body!

  const payload = jwtService.verifyRefreshToken(refreshToken)

  if (!payload) {
    return apiError("Refresh token invalide ou expiré", 401)
  }

  const tokens = jwtService.generateTokenPair(payload.userId)

  return apiSuccess(tokens)
}

export const POST = withMiddleware(
  validateBody({
    refreshToken: { type: "string", required: true },
  }),
  handler
)
