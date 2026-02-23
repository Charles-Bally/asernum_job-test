export { wipeDatabase, seedAdminUser } from "./demo-seed-wipe"
export { seedAllUsers } from "./demo-seed-users"
export { seedStores } from "./demo-seed-stores"
export { seedStoreData, seedEvents } from "./demo-seed-data"
export type { Uid, StoreWithCashiers } from "./demo-seed-utils"

import { wipeDatabase, seedAdminUser } from "./demo-seed-wipe"
import { seedAllUsers } from "./demo-seed-users"
import { seedStores } from "./demo-seed-stores"
import { seedStoreData, seedEvents } from "./demo-seed-data"

export async function runFullSeed() {
  await wipeDatabase()
  const admin = await seedAdminUser()
  const { managers, rcs, cashiers } = await seedAllUsers()
  const stores = await seedStores(managers, rcs, cashiers)
  const { totalClients, totalTx } = await seedStoreData(stores, admin.id)
  await seedEvents(admin.id, managers, rcs, cashiers)

  return {
    users: 1 + managers.length + rcs.length + cashiers.length,
    stores: stores.length,
    clients: totalClients,
    transactions: totalTx,
  }
}
