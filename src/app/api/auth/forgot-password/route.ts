import type { ApiContext } from "@/app/api/_helpers/middleware.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import { validateBody } from "@/app/api/_helpers/validate.helper"
import { emailService } from "@/services/api/email.service"
import { otpStore } from "@/services/api/otp.store"
import { prisma } from "@/services/api/prisma.service"
import { NextRequest } from "next/server"

async function handler(_req: NextRequest, context: ApiContext) {
  const { email } = context.body!

  const user = await prisma.user.findUnique({
    where: { email },
  })

  // Pas de leak d'email : on retourne succès même si l'email n'existe pas
  if (!user) {
    return apiSuccess({ message: "Email envoyé" })
  }

  const otp = otpStore.generateOtp()
  await otpStore.set(email, otp)

  try {
    await emailService.sendEmail({
      to: email,
      subject: "Réinitialisation de votre mot de passe Auchan — Asernum",
      templateName: "reset-password",
      data: { otp },
    })
  } catch (error) {
    console.error("Erreur envoi email:", error)
    return apiError("Erreur lors de l'envoi de l'email", 500)
  }

  return apiSuccess({ message: "Email envoyé" })
}

export const POST = withMiddleware(
  validateBody({
    email: { type: "string", required: true },
  }),
  handler
)
