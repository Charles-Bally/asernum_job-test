import { NextRequest } from "next/server"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { authMiddleware } from "@/app/api/_helpers/auth.helper"
import { apiSuccess, apiError } from "@/app/api/_helpers/response.helper"
import { prisma } from "@/services/api/prisma.service"
import type { ApiContext } from "@/app/api/_helpers/middleware.helper"

async function handler(_req: NextRequest, context: ApiContext) {
  const user = await prisma.user.findUnique({
    where: { id: context.userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  })

  if (!user) {
    return apiError("Utilisateur introuvable", 404)
  }

  return apiSuccess(user)
}

export const GET = withMiddleware(authMiddleware, handler)
