export type EventAction =
  | "CREATED"
  | "BLOCKED"
  | "UNBLOCKED"
  | "PASSWORD_RESET"
  | "ROLE_CHANGED"
  | "ASSIGNED_STORE"

export type AccountEvent = {
  id: string
  userId: string
  userName: string
  action: EventAction
  description: string
  performedBy: string
  createdAt: string
}

export type AccountEventsData = {
  rows: AccountEvent[]
  total: number
  page: number
  totalPages: number
}

export const EVENT_ACTION_LABELS: Record<EventAction, string> = {
  CREATED: "Création",
  BLOCKED: "Blocage",
  UNBLOCKED: "Déblocage",
  PASSWORD_RESET: "Reset mot de passe",
  ROLE_CHANGED: "Changement de rôle",
  ASSIGNED_STORE: "Affectation magasin",
}
