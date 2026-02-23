import { prisma } from "@/services/api/prisma.service"
import bcrypt from "bcryptjs"

export async function wipeDatabase(): Promise<void> {
  await prisma.accountEvent.deleteMany()
  await prisma.cashierHistory.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.client.deleteMany()
  await prisma.otp.deleteMany()
  await prisma.store.deleteMany()
  await prisma.user.deleteMany()
}

export async function seedAdminUser() {
  const hash = await bcrypt.hash("Password1234@", 10)
  return prisma.user.create({
    data: {
      email: "admin@asernum-job.com",
      password: hash,
      firstName: "Charles",
      lastName: "Bally",
      role: "ADMIN",
    },
  })
}
