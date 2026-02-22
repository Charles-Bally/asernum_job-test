import { randomDelay } from "@/app/api/_helpers/delay.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { paginate } from "@/app/api/_helpers/pagination.helper"
import { apiSuccess } from "@/app/api/_helpers/response.helper"
import type { AccountEvent, EventAction } from "@/types/account-event.types"
import type { NextRequest } from "next/server"

const ACTIONS: EventAction[] = [
  "CREATED", "BLOCKED", "UNBLOCKED", "PASSWORD_RESET", "ROLE_CHANGED", "ASSIGNED_STORE",
]

const DESCRIPTIONS: Record<EventAction, string> = {
  CREATED: "Compte créé avec le rôle",
  BLOCKED: "Compte bloqué pour tentatives suspectes",
  UNBLOCKED: "Compte débloqué par l'administrateur",
  PASSWORD_RESET: "Mot de passe réinitialisé",
  ROLE_CHANGED: "Rôle modifié de Caissier à Manager",
  ASSIGNED_STORE: "Affecté au magasin Angré Djibi 1",
}

const USERS = [
  { id: "USR-0001", name: "Amadou Konaté" },
  { id: "USR-0002", name: "Fatou Diallo" },
  { id: "USR-0003", name: "Koné Traoré" },
  { id: "USR-0004", name: "Awa Coulibaly" },
  { id: "USR-0005", name: "Ibrahim Touré" },
  { id: "USR-0008", name: "Aïcha Camara" },
  { id: "USR-0010", name: "Djénéba Diarra" },
]

const PERFORMERS = ["Admin Système", "Fatou Diallo", "Ibrahim Touré", "Auto"]

const MOCK_EVENTS: AccountEvent[] = Array.from({ length: 30 }, (_, i) => {
  const user = USERS[i % USERS.length]
  const action = ACTIONS[i % ACTIONS.length]
  return {
    id: `EVT-${String(i + 1).padStart(4, "0")}`,
    userId: user.id,
    userName: user.name,
    action,
    description: DESCRIPTIONS[action],
    performedBy: PERFORMERS[i % PERFORMERS.length],
    createdAt: new Date(2025, 0, 30 - i).toLocaleDateString("fr-FR"),
  }
})

export const GET = withMiddleware(async (req: NextRequest) => {
  await randomDelay()
  const params = req.nextUrl.searchParams
  const page = Number(params.get("page") || "1")
  const limit = Number(params.get("limit") || "10")
  const search = params.get("search") || ""
  const action = params.get("action") || ""
  const userId = params.get("userId") || ""

  let filtered = MOCK_EVENTS

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (e) =>
        e.userName.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
    )
  }

  if (action) filtered = filtered.filter((e) => e.action === action)
  if (userId) filtered = filtered.filter((e) => e.userId === userId)

  return apiSuccess(paginate(filtered, page, limit))
})
