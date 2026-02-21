import { prisma } from "@/services/api/prisma.service"

const DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

function generateOtp(): string {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

async function set(email: string, otp: string, ttl = DEFAULT_TTL): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (!user) return

  // Marquer les anciens OTP du user comme utilisés
  await prisma.otp.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  })

  await prisma.otp.create({
    data: {
      code: otp,
      userId: user.id,
      expiresAt: new Date(Date.now() + ttl),
    },
  })
}

async function verify(email: string, otp: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (!user) return false

  const entry = await prisma.otp.findFirst({
    where: {
      userId: user.id,
      code: otp,
      used: false,
      expiresAt: { gt: new Date() },
    },
  })

  if (!entry) return false

  await prisma.otp.update({
    where: { id: entry.id },
    data: { used: true },
  })

  return true
}

async function cleanup(): Promise<void> {
  await prisma.otp.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  })
}

export const otpStore = { generateOtp, set, verify, cleanup }
