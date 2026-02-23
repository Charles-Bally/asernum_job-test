"use client"

import { useCallback, useState } from "react"
import type {
  DataResponse,
  SeedProgress,
  StoresResponse,
  UsersResponse,
  WipeResponse,
} from "./demo-seed.types"

const STEPS = [
  { label: "Nettoyage de la base", path: "/api/demo/seed/wipe" },
  { label: "Création des utilisateurs", path: "/api/demo/seed/users" },
  { label: "Création des magasins", path: "/api/demo/seed/stores" },
  { label: "Génération des données", path: "/api/demo/seed/data" },
] as const

const INITIAL_PROGRESS: SeedProgress = {
  currentStep: 0,
  totalSteps: STEPS.length,
  currentLabel: "",
  status: "idle",
}

async function postStep<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json()
  if (json.status !== "success") {
    throw new Error(json.error ?? "Erreur inconnue")
  }
  return json.data as T
}

export function useSeedRunner() {
  const [progress, setProgress] = useState<SeedProgress>(INITIAL_PROGRESS)

  const advance = (step: number) => {
    setProgress({
      currentStep: step,
      totalSteps: STEPS.length,
      currentLabel: STEPS[step].label,
      status: "running",
    })
  }

  const run = useCallback(async () => {
    try {
      // Step 0 — Wipe
      advance(0)
      const { adminId } = await postStep<WipeResponse>(STEPS[0].path)

      // Step 1 — Users
      advance(1)
      const { managers, rcs, cashiers } = await postStep<UsersResponse>(STEPS[1].path)

      // Step 2 — Stores
      advance(2)
      const { stores } = await postStep<StoresResponse>(STEPS[2].path, {
        managers, rcs, cashiers,
      })

      // Step 3 — Data
      advance(3)
      await postStep<DataResponse>(STEPS[3].path, {
        adminId, stores, managers, rcs, cashiers,
      })

      setProgress((p) => ({ ...p, status: "success", currentLabel: "Terminé" }))
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue"
      setProgress((p) => ({ ...p, status: "error", error: message }))
    }
  }, [])

  const reset = useCallback(() => setProgress(INITIAL_PROGRESS), [])

  return { progress, run, reset }
}

export { STEPS }
