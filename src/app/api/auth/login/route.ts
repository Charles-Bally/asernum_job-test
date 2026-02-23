import { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { validateBody } from "@/app/api/_helpers/validate.helper"
import { apiSuccess, apiError } from "@/app/api/_helpers/response.helper"
import { jwtService } from "@/services/api/jwt.service"
import { prisma } from "@/services/api/prisma.service"
import type { ApiContext } from "@/app/api/_helpers/middleware.helper"

async function handler(_req: NextRequest, context: ApiContext) {
  const { identifier, password } = context.body!

  const user = await prisma.user.findUnique({
    where: { email: identifier },
  })

  if (!user) {
    return apiError("Identifiants incorrects", 401)
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return apiError("Identifiants incorrects", 401)
  }

  if (user.isBlocked) {
    return apiError("Votre compte a été bloqué. Veuillez contacter un administrateur.", 403)
  }

  if (user.role !== "ADMIN") {
    return apiError("Accès réservé aux administrateurs. Votre rôle actuel ne permet pas d'accéder à cette plateforme.", 403)
  }

  const tokens = jwtService.generateTokenPair(user.id)

  return apiSuccess({
    ...tokens,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  })
}

export const POST = withMiddleware(
  validateBody({
    identifier: { type: "string", required: true },
    password: { type: "string", required: true },
  }),
  handler
)
