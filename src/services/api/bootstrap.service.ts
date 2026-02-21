import { seedAdmin } from "@/services/api/bootstraps/seed-admin.bootstrap"

type BootstrapFn = () => Promise<void>

const bootstraps: BootstrapFn[] = [seedAdmin]

async function run(): Promise<void> {
  for (const bootstrap of bootstraps) {
    await bootstrap()
  }
}

export const bootstrapService = { run }
