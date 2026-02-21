import { NextRequest } from "next/server"
import bcrypt from "bcrypt"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { validateBody } from "@/app/api/_helpers/validate.helper"
import { apiSuccess, apiError } from "@/app/api/_helpers/response.helper"
import { jwtService } from "@/services/api/jwt.service"
import { prisma } from "@/services/api/prisma.service"
import type { ApiContext } from "@/app/api/_helpers/middleware.helper"

async function handler(_req: NextRequest, context: ApiContext) {
  const { resetToken, password } = context.body!

  const payload = jwtService.verifyResetToken(resetToken)

  if (!payload) {
    return apiError("Token de réinitialisation invalide ou expiré", 401)
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.update({
    where: { id: payload.userId },
    data: { password: hashedPassword },
  })

  return apiSuccess({ message: "Mot de passe réinitialisé avec succès" })
}

export const POST = withMiddleware(
  validateBody({
    resetToken: { type: "string", required: true },
    password: { type: "string", required: true },
  }),
  handler
)
