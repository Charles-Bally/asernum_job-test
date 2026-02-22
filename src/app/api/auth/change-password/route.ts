import { NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { authMiddleware } from "@/app/api/_helpers/auth.helper"
import { apiSuccess, apiError } from "@/app/api/_helpers/response.helper"
import { prisma } from "@/services/api/prisma.service"
import type { ApiContext } from "@/app/api/_helpers/middleware.helper"

async function handler(req: NextRequest, context: ApiContext) {
  const { currentPassword, newPassword } = await req.json()

  if (!currentPassword || !newPassword) {
    return apiError("Les deux mots de passe sont requis", 400)
  }

  if (newPassword.length < 8) {
    return apiError("Le nouveau mot de passe doit contenir au moins 8 caractères", 400)
  }

  const user = await prisma.user.findUnique({
    where: { id: context.userId },
    select: { id: true, password: true },
  })

  if (!user) {
    return apiError("Utilisateur introuvable", 404)
  }

  const isValid = await bcrypt.compare(currentPassword, user.password)
  if (!isValid) {
    return apiError("Mot de passe actuel incorrect", 401)
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  })

  return apiSuccess({ message: "Mot de passe modifié avec succès" })
}

export const POST = withMiddleware(authMiddleware, handler)
