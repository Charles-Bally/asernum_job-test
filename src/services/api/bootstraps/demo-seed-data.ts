import { prisma } from "@/services/api/prisma.service"
import { faker } from "@faker-js/faker/locale/fr"
import {
  amount, date30d, daysAgo, phone, pick, txType,
  type StoreWithCashiers, type Uid,
} from "./demo-seed-utils"

export async function seedStoreData(
  stores: StoreWithCashiers[], adminId: string
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

    await prisma.cashierHistory.createMany({
      data: store.cashierIds.map((cid) => ({
        cashierId: cid,
        storeId: store.id,
        assignedById: adminId,
        assignedAt: date30d(),
      })),
    })
  }

  await seedRichCashierHistory(stores, adminId)
  return { totalClients, totalTx }
}

async function seedRichCashierHistory(
  stores: StoreWithCashiers[], adminId: string
) {
  if (stores.length < 4) return

  for (let si = 0; si < stores.length; si++) {
    const store = stores[si]
    const enriched = store.cashierIds.slice(0, Math.min(3, store.cashierIds.length))

    for (let ci = 0; ci < enriched.length; ci++) {
      const cashierId = enriched[ci]
      const pastStoreCount = ci === 0 ? 3 : 2
      const pastStores = stores
        .filter((s) => s.id !== store.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, pastStoreCount)

      let cursor = 180 + Math.floor(Math.random() * 90)

      for (const pastStore of pastStores) {
        const duration = 20 + Math.floor(Math.random() * 40)
        const assignedAt = daysAgo(cursor)
        const removedAt = daysAgo(cursor - duration)
        cursor = cursor - duration - faker.number.int({ min: 3, max: 14 })

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

export async function seedEvents(adminId: string, ...groups: Uid[][]) {
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
