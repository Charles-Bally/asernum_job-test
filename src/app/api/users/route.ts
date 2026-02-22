import { randomDelay } from "@/app/api/_helpers/delay.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { paginate } from "@/app/api/_helpers/pagination.helper"
import { apiSuccess } from "@/app/api/_helpers/response.helper"
import type { User, UserRole } from "@/types/user.types"
import type { NextRequest } from "next/server"

const ROLES: UserRole[] = ["ADMIN", "MANAGER", "RESPONSABLE_CAISSES", "CAISSIER"]
const STORES = ["Angré Djibi 1", "Cocody Centre", "Marcory Zone 4", "Plateau Commerce", null]

const FIRST_NAMES = [
  "Amadou", "Fatou", "Koné", "Awa", "Ibrahim",
  "Mariame", "Ousmane", "Aïcha", "Moussa", "Djénéba",
  "Sékou", "Bintou", "Youssouf", "Aminata", "Bakary",
  "Salimata", "Drissa", "Karidja", "Souleymane", "Mariam",
  "Ismaël", "Rokia", "Abdoulaye", "Fatoumata", "Tidiane",
]

const LAST_NAMES = [
  "Konaté", "Diallo", "Traoré", "Coulibaly", "Touré",
  "Bamba", "Ouattara", "Camara", "Sylla", "Diarra",
  "Koné", "Sangaré", "Cissé", "Dembélé", "Keïta",
  "Fofana", "Doumbia", "Diabaté", "Sissoko", "Haidara",
  "Sidibé", "Sow", "Ndiaye", "Kanté", "Bah",
]

const MOCK_USERS: User[] = Array.from({ length: 80 }, (_, i) => ({
  id: `USR-${String(i + 1).padStart(4, "0")}`,
  firstName: FIRST_NAMES[i % FIRST_NAMES.length],
  lastName: LAST_NAMES[i % LAST_NAMES.length],
  email: `${FIRST_NAMES[i % FIRST_NAMES.length].toLowerCase()}.${LAST_NAMES[i % LAST_NAMES.length].toLowerCase()}${i >= 25 ? i : ""}@auchan.ci`,
  role: ROLES[i % ROLES.length],
  status: i % 7 === 0 ? "blocked" as const : "active" as const,
  store: STORES[i % STORES.length],
  createdAt: new Date(2024, Math.floor(i / 3), (i % 28) + 1).toLocaleDateString("fr-FR"),
  blockedAt: i % 7 === 0 ? "15/01/2025" : null,
  blockReason: i % 7 === 0 ? "Tentatives de connexion suspectes" : null,
}))

function generatePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
}

function generateAccessCode(): string {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join("")
}

export const GET = withMiddleware(async (req: NextRequest) => {
  await randomDelay()
  const params = req.nextUrl.searchParams
  const page = Number(params.get("page") || "1")
  const limit = Number(params.get("limit") || "10")
  const search = params.get("search") || ""
  const role = params.get("role") || ""
  const status = params.get("status") || ""

  let filtered = MOCK_USERS

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (u) =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    )
  }

  if (role) filtered = filtered.filter((u) => u.role === role)
  if (status) filtered = filtered.filter((u) => u.status === status)

  return apiSuccess({ ...paginate(filtered, page, limit), roles: ROLES })
})

export const POST = withMiddleware(async (req: NextRequest) => {
  await randomDelay()

  const body = await req.json()
  const { firstName, lastName, email, role } = body

  if (!firstName || !lastName || !email || !role) {
    return apiSuccess({ error: "Champs requis manquants" })
  }

  const newUser: User = {
    id: `USR-${String(MOCK_USERS.length + 1).padStart(4, "0")}`,
    firstName,
    lastName,
    email,
    role,
    status: "active",
    store: null,
    createdAt: new Date().toLocaleDateString("fr-FR"),
    blockedAt: null,
    blockReason: null,
  }

  const generatedPassword = generatePassword()
  const isAdmin = role === "ADMIN"
  const accessCode = isAdmin ? null : generateAccessCode()

  console.log(`[DEV] Mock email — New password for ${email}: ${generatedPassword}`)
  if (accessCode) {
    console.log(`[DEV] Mock email — Access code for ${email}: ${accessCode}`)
  }

  return apiSuccess({ user: newUser, hasAccessCode: !isAdmin, success: true })
})
