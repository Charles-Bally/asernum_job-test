import { STORE_LOCATIONS } from "@/services/api/bootstraps/demo-locations.constant"
import { prisma } from "@/services/api/prisma.service"
import { faker } from "@faker-js/faker/locale/fr"
import bcrypt from "bcryptjs"

const STORE_COUNT = STORE_LOCATIONS.length
const MANAGERS_COUNT = 50
const RC_COUNT = 50
const CASHIERS_COUNT = 300

function accessKey(): string {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  return Array.from({ length: 4 }, () => c[Math.floor(Math.random() * c.length)]).join("")
}

function phone(index: number): string {
  const base = 100000000 + index
  return `+2250${String(base).slice(0, 10)}`
}

function txType(): "PAIEMENT_COURSE" | "RENDU_MONNAIE" {
  return Math.random() < 0.75 ? "PAIEMENT_COURSE" : "RENDU_MONNAIE"
}

function amount(): number {
  const v = [500, 1000, 1500, 2000, 2500, 3000, 5000, 7500, 10000, 15000, 25000, 50000]
  return v[Math.floor(Math.random() * v.length)]
}

function date30d(): Date {
  return new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 3600 * 1000))
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

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

export async function runFullSeed() {
  await wipeDatabase()
  const admin = await seedAdminUser()
  const hash = await bcrypt.hash("Password1234@", 10)
  const ts = Date.now()

  const managers = await createUsers(MANAGERS_COUNT, "MANAGER", hash, ts)
  const rcs = await createUsers(RC_COUNT, "RESPONSABLE_CAISSES", hash, ts + 1000)
  const cashiers = await createUsers(CASHIERS_COUNT, "CAISSIER", hash, ts + 2000)

  const stores = await createStores(managers, rcs, cashiers)
  const { totalClients, totalTx } = await seedStoreData(stores, admin.id)
  await seedEvents(admin.id, managers, rcs, cashiers)

  return {
    users: 1 + managers.length + rcs.length + cashiers.length,
    stores: stores.length,
    clients: totalClients,
    transactions: totalTx,
  }
}

type Uid = { id: string }

async function createUsers(
  count: number, role: "MANAGER" | "RESPONSABLE_CAISSES" | "CAISSIER",
  hash: string, seed: number
): Promise<Uid[]> {
  const users: Uid[] = []
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const user = await prisma.user.create({
      data: {
        email: `${role.toLowerCase()}.${seed}.${i}@demo.asernum.job`,
        password: hash,
        firstName,
        lastName,
        role,
        accessKey: role === "CAISSIER" ? accessKey() : undefined,
      },
    })
    users.push({ id: user.id })
  }
  return users
}

async function createStores(
  managers: Uid[], rcs: Uid[], cashiers: Uid[]
) {
  const perStore = Math.floor(cashiers.length / STORE_COUNT)
  const results: { id: string; cashierIds: string[] }[] = []

  for (let i = 0; i < STORE_COUNT; i++) {
    const loc = STORE_LOCATIONS[i]
    const slice = cashiers.slice(i * perStore, (i + 1) * perStore)

    const store = await prisma.store.create({
      data: {
        name: `Auchan ${loc.commune} ${loc.quartier}`,
        code: `MAG-${String(i + 1).padStart(3, "0")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
        ville: loc.ville,
        commune: loc.commune,
        quartier: loc.quartier,
        managerId: managers[i % managers.length].id,
        responsableCaissesId: rcs[i % rcs.length].id,
        cashiers: { connect: slice.map((c) => ({ id: c.id })) },
      },
    })
    results.push({ id: store.id, cashierIds: slice.map((c) => c.id) })
  }
  return results
}

async function seedStoreData(
  stores: { id: string; cashierIds: string[] }[], adminId: string
) {
  let totalClients = 0
  let totalTx = 0
  let phoneIdx = 0

  for (const store of stores) {
    const clientCount = faker.number.int({ min: 15, max: 30 })
    const clientIds: string[] = []

    for (let c = 0; c < clientCount; c++) {
      const cl = await prisma.client.create({
        data: {
          phone: phone(phoneIdx++),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          storeId: store.id,
        },
      })
      clientIds.push(cl.id)
    }
    totalClients += clientCount

    const txCount = faker.number.int({ min: 80, max: 150 })
    await prisma.transaction.createMany({
      data: Array.from({ length: txCount }, () => ({
        type: txType(),
        amount: amount(),
        createdAt: date30d(),
        storeId: store.id,
        cashierId: pick(store.cashierIds),
        clientId: Math.random() < 0.7 ? pick(clientIds) : null,
      })),
    })
    totalTx += txCount

    // Historique basique pour tous les caissiers (affectation actuelle)
    await prisma.cashierHistory.createMany({
      data: store.cashierIds.map((cid) => ({
        cashierId: cid,
        storeId: store.id,
        assignedById: adminId,
        assignedAt: date30d(),
      })),
    })
  }

  // Historique enrichi pour les 3 premiers caissiers de chaque magasin
  await seedRichCashierHistory(stores, adminId)

  return { totalClients, totalTx }
}

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 3600 * 1000)
}

async function seedRichCashierHistory(
  stores: { id: string; cashierIds: string[] }[],
  adminId: string
) {
  if (stores.length < 4) return

  for (let si = 0; si < stores.length; si++) {
    const store = stores[si]
    const enriched = store.cashierIds.slice(0, Math.min(3, store.cashierIds.length))

    for (let ci = 0; ci < enriched.length; ci++) {
      const cashierId = enriched[ci]
      // Choisir 2-3 anciens magasins différents du magasin actuel
      const pastStoreCount = ci === 0 ? 3 : 2
      const pastStores = stores
        .filter((s) => s.id !== store.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, pastStoreCount)

      let cursor = 180 + Math.floor(Math.random() * 90) // début il y a 6-9 mois

      for (const pastStore of pastStores) {
        const duration = 20 + Math.floor(Math.random() * 40) // 20-60 jours
        const assignedAt = daysAgo(cursor)
        const removedAt = daysAgo(cursor - duration)
        cursor = cursor - duration - faker.number.int({ min: 3, max: 14 }) // gap entre affectations

        await prisma.cashierHistory.create({
          data: {
            cashierId,
            storeId: pastStore.id,
            assignedById: adminId,
            assignedAt,
            removedAt,
          },
        })
      }
    }
  }
}

async function seedEvents(adminId: string, ...groups: Uid[][]) {
  const all = groups.flat()
  await prisma.accountEvent.createMany({
    data: [{ id: adminId }, ...all].map((u) => ({
      action: "CREATED" as const,
      userId: u.id,
      performedById: adminId,
      description: "Compte créé lors du seed démo",
    })),
  })
  const cashiers = groups[2] ?? []
  if (cashiers.length > 0) {
    await prisma.accountEvent.createMany({
      data: cashiers.map((c) => ({
        action: "ASSIGNED_STORE" as const,
        userId: c.id,
        performedById: adminId,
        description: "Assigné à un magasin lors du seed démo",
      })),
    })
  }
}
