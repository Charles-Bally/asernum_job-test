import { prisma } from "@/services/api/prisma.service"
import bcrypt from "bcryptjs"

const ADMIN_EMAILS = [
  { email: "admin@asernum-job.com", firstName: "Charles", lastName: "Bally" },
]

export async function seedAdmin(): Promise<void> {

  const hashedPassword = await bcrypt.hash("Password1234@", 10)
  for (const admin of ADMIN_EMAILS) {
    const existing = await prisma.user.findUnique({
      where: { email: admin.email },
    })
    if (existing) continue
    await prisma.user.create({
      data: {
        email: admin.email,
        role: "ADMIN",
        password: hashedPassword,
        firstName: admin.firstName,
        lastName: admin.lastName,
      },
    })
  }
}
