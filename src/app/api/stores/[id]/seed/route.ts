
import { authMiddleware, requireRole } from "@/app/api/_helpers/auth.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import { prisma } from "@/services/api/prisma.service"
import { faker } from "@faker-js/faker/locale/fr"
import type { NextRequest } from "next/server"

function randomPhone(): string {
  const suffix = faker.string.numeric(6)
  return `+2250700${suffix}`
}

function randomDate(daysBack: number): Date {
  const now = Date.now()
  const past = now - daysBack * 24 * 60 * 60 * 1000
  return new Date(past + Math.random() * (now - past))
}

function weightedRandom<T>(options: { value: T; weight: number }[]): T {
  const total = options.reduce((sum, o) => sum + o.weight, 0)
  let rand = Math.random() * total
  for (const option of options) {
    rand -= option.weight
    if (rand <= 0) return option.value
  }
  return options[0].value
}

export const POST = withMiddleware(
  authMiddleware,
  requireRole("ADMIN"),
  async (req: NextRequest, context) => {
    const code = req.nextUrl.pathname.split("/").at(-2) || ""
    const body = await req.json()

    const {
      generateClients = false,
      generateTransactions = false,
      clientCount = faker.number.int({ min: 10, max: 20 }),
      transactionCount = faker.number.int({ min: 40, max: 60 }),
    } = body

    const store = await prisma.store.findUnique({
      where: { code },
      include: { cashiers: { select: { id: true } } },
    })

    if (!store) return apiError("Magasin introuvable", 404)

    const cashierIds = store.cashiers.map((c) => c.id)

    if (generateTransactions && cashierIds.length === 0) {
      return apiError("Aucun caissier assigné — impossible de générer des transactions", 400)
    }

    let clientsCreated = 0
    let transactionsCreated = 0
    let cashierHistoryCreated = 0
    const createdClientIds: string[] = []

    if (generateClients) {
      const clients = Array.from({ length: clientCount }, () => ({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phone: randomPhone(),
        status: weightedRandom([
          { value: "ACTIVE" as const, weight: 90 },
          { value: "INACTIVE" as const, weight: 10 },
        ]),
        storeId: store.id,
      }))

      const result = await prisma.client.createMany({ data: clients })
      clientsCreated = result.count

      const created = await prisma.client.findMany({
        where: { storeId: store.id },
        select: { id: true },
        orderBy: { createdAt: "desc" },
        take: clientCount,
      })
      createdClientIds.push(...created.map((c) => c.id))
    }

    if (generateTransactions) {
      const allClients = createdClientIds.length > 0
        ? createdClientIds
        : (await prisma.client.findMany({
            where: { storeId: store.id },
            select: { id: true },
          })).map((c) => c.id)

      const transactions = Array.from({ length: transactionCount }, () => {
        const type = weightedRandom([
          { value: "PAIEMENT_COURSE" as const, weight: 60 },
          { value: "RENDU_MONNAIE" as const, weight: 40 },
        ])
        const amount = Math.round(faker.number.int({ min: 5, max: 1500 })) * 100
        const hasClient = allClients.length > 0 && Math.random() > 0.2
        return {
          type,
          amount,
          storeId: store.id,
          cashierId: faker.helpers.arrayElement(cashierIds),
          clientId: hasClient ? faker.helpers.arrayElement(allClients) : null,
          createdAt: randomDate(30),
        }
      })

      const result = await prisma.transaction.createMany({ data: transactions })
      transactionsCreated = result.count

      const histories = cashierIds.map((cashierId) => ({
        cashierId,
        storeId: store.id,
        assignedById: context.userId!,
        assignedAt: randomDate(60),
      }))

      const histResult = await prisma.cashierHistory.createMany({ data: histories })
      cashierHistoryCreated = histResult.count
    }

    return apiSuccess({ clientsCreated, transactionsCreated, cashierHistoryCreated }, 201)
  }
)
