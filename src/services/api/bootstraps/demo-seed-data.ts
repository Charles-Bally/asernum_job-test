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
    const clientCount = faker.number.int({ min: 8, max: 15 })

    const clientData = Array.from({ length: clientCount }, () => ({
      phone: phone(phoneIdx++),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      storeId: store.id,
    }))

    const clients = await prisma.client.createManyAndReturn({
      data: clientData,
      select: { id: true },
    })
    const clientIds = clients.map((c) => c.id)
    totalClients += clientCount

    const txCount = faker.number.int({ min: 30, max: 60 })
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

  const allRecords: {
    cashierId: string; storeId: string
    assignedById: string; assignedAt: Date; removedAt: Date
  }[] = []

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
        allRecords.push({
          cashierId,
          storeId: pastStore.id,
          assignedById: adminId,
          assignedAt: daysAgo(cursor),
          removedAt: daysAgo(cursor - duration),
        })
        cursor = cursor - duration - faker.number.int({ min: 3, max: 14 })
      }
    }
  }

  await prisma.cashierHistory.createMany({ data: allRecords })
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
