import { NextRequest } from "next/server"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { validateBody } from "@/app/api/_helpers/validate.helper"
import { apiSuccess, apiError } from "@/app/api/_helpers/response.helper"
import { otpStore } from "@/services/api/otp.store"
import { jwtService } from "@/services/api/jwt.service"
import { prisma } from "@/services/api/prisma.service"
import type { ApiContext } from "@/app/api/_helpers/middleware.helper"

async function handler(_req: NextRequest, context: ApiContext) {
  const { email, otp } = context.body!

  const isValid = await otpStore.verify(email, otp)

  if (!isValid) {
    return apiError("Code OTP invalide ou expiré", 400)
  }

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return apiError("Utilisateur introuvable", 404)
  }

  const resetToken = jwtService.signResetToken(user.id)

  return apiSuccess({ resetToken })
}

export const POST = withMiddleware(
  validateBody({
    email: { type: "string", required: true },
    otp: { type: "string", required: true },
  }),
  handler
)
