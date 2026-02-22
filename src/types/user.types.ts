export type UserRole = "ADMIN" | "MANAGER" | "RESPONSABLE_CAISSES" | "CAISSIER"

export type UserStatus = "active" | "blocked"

export type User = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  status: UserStatus
  store: string | null
  createdAt: string
  blockedAt: string | null
  blockReason: string | null
}

export type CreateUserPayload = {
  firstName: string
  lastName: string
  email: string
  role: UserRole
}

export type UsersData = {
  rows: User[]
  total: number
  page: number
  totalPages: number
  roles: UserRole[]
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrateur",
  MANAGER: "Manager",
  RESPONSABLE_CAISSES: "Resp. Caisses",
  CAISSIER: "Caissier",
}
