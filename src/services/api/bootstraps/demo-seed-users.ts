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
  const users: Uid[] = []
  for (let i = 0; i < count; i++) {
    const user = await prisma.user.create({
      data: {
        email: `${role.toLowerCase()}.${seed}.${i}@demo.asernum.job`,
        password: hash,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        role,
        accessKey: role === "CAISSIER" ? accessKey() : undefined,
      },
    })
    users.push({ id: user.id })
  }
  return users
}

export async function seedAllUsers() {
  const hash = await bcrypt.hash("Password1234@", 10)
  const ts = Date.now()

  const managers = await createUsers(MANAGERS_COUNT, "MANAGER", hash, ts)
  const rcs = await createUsers(RC_COUNT, "RESPONSABLE_CAISSES", hash, ts + 1000)
  const cashiers = await createUsers(CASHIERS_COUNT, "CAISSIER", hash, ts + 2000)

  return { managers, rcs, cashiers }
}
