import { prisma } from "@/services/api/prisma.service"
import bcrypt from "bcrypt"

const ADMIN_EMAILS = [
  { email: "admin@asernum-job.com", firstName: "Charles", lastName: "Bally" },
  { email: "mygamer.99id@gmail.com", firstName: "Charles Personal", lastName: "Contact" },
]

export async function seedAdmin(): Promise<void> {

  const hashedPassword = await bcrypt.hash("Password1234@", 10)
  for (const admin of ADMIN_EMAILS) {
    const existing = await prisma.user.findUnique({
      where: { email: admin.email },
    })
    if (existing) {
      console.log("[Bootstrap] Admin user already exists")
      continue
    }
    await prisma.user.create({
      data: {
        email: admin.email,
        password: hashedPassword,
        firstName: admin.firstName,
        lastName: admin.lastName,
      },
    })
  }

  console.log("[Bootstrap] Admin users created")
}
