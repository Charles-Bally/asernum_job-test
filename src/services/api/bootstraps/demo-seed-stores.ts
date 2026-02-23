import { STORE_LOCATIONS } from "@/services/api/bootstraps/demo-locations.constant"
import { prisma } from "@/services/api/prisma.service"
import type { StoreWithCashiers, Uid } from "./demo-seed-utils"

const STORE_COUNT = STORE_LOCATIONS.length
const BATCH_SIZE = 10

export async function seedStores(
  managers: Uid[], rcs: Uid[], cashiers: Uid[]
): Promise<StoreWithCashiers[]> {
  const perStore = Math.floor(cashiers.length / STORE_COUNT)
  const results: StoreWithCashiers[] = []

  for (let b = 0; b < STORE_COUNT; b += BATCH_SIZE) {
    const batch = Array.from(
      { length: Math.min(BATCH_SIZE, STORE_COUNT - b) },
      (_, j) => b + j,
    )

    const created = await Promise.all(
      batch.map(async (i) => {
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
        return { id: store.id, cashierIds: slice.map((c) => c.id) }
      }),
    )
    results.push(...created)
  }
  return results
}
