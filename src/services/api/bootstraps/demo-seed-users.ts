import { prisma } from "@/services/api/prisma.service"
import { faker } from "@faker-js/faker/locale/fr"
import bcrypt from "bcryptjs"
import { accessKey, type Uid } from "./demo-seed-utils"

const MANAGERS_COUNT = 30
const RC_COUNT = 30
const CASHIERS_COUNT = 150

async function createUsers(
  count: number, role: "MANAGER" | "RESPONSABLE_CAISSES" | "CAISSIER",
  hash: string, seed: number
): Promise<Uid[]> {
  const data = Array.from({ length: count }, (_, i) => ({
    email: `${role.toLowerCase()}.${seed}.${i}@demo.asernum.job`,
    password: hash,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    role,
    accessKey: role === "CAISSIER" ? accessKey() : undefined,
  }))

  const users = await prisma.user.createManyAndReturn({
    data,
    select: { id: true },
  })
  return users
}

export async function seedAllUsers() {
  const hash = await bcrypt.hash("Password1234@", 10)
  const ts = Date.now()

  const [managers, rcs, cashiers] = await Promise.all([
    createUsers(MANAGERS_COUNT, "MANAGER", hash, ts),
    createUsers(RC_COUNT, "RESPONSABLE_CAISSES", hash, ts + 1000),
    createUsers(CASHIERS_COUNT, "CAISSIER", hash, ts + 2000),
  ])

  return { managers, rcs, cashiers }
}
