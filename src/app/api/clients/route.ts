import { randomDelay } from "@/app/api/_helpers/delay.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { paginate } from "@/app/api/_helpers/pagination.helper"
import { apiSuccess } from "@/app/api/_helpers/response.helper"
import type { Client } from "@/types/client.types"
import type { NextRequest } from "next/server"

const STORES = [
  { name: "Angré Djibi 1", code: "M0001" },
  { name: "Marcory Zone 4", code: "M0002" },
  { name: "Plateau Centre", code: "M0003" },
  { name: "Yopougon Selmer", code: "M0004" },
  { name: "Treichville Gare", code: "M0005" },
]

const FIRST_NAMES = [
  "Kouadio", "Aminata", "Sékou", "Fatou", "Yao",
  "Awa", "Moussa", "Adjoua", "Ibrahim", "Mariam",
  "Konan", "Bintou", "Oumar", "Salimata", "Hervé",
]
const LAST_NAMES = [
  "Koné", "Traoré", "Coulibaly", "Diallo", "Ouattara",
  "Bamba", "Touré", "Sylla", "Konaté", "Sanogo",
  "Dembélé", "Cissé", "Fofana", "Diabaté", "Soro",
]
const PHONES = [
  "+225 07 63 32 22 32", "+225 01 02 03 04 05", "+225 05 06 07 08 09",
  "+225 07 08 06 05 04", "+225 09 12 34 56 78", "+225 01 45 67 89 01",
  "+225 05 23 45 67 89", "+225 07 11 22 33 44", "+225 01 55 66 77 88",
  "+225 09 99 88 77 66",
]
const DATES = [
  "20/01/2025", "19/01/2025", "18/01/2025", "17/01/2025",
  "16/01/2025", "15/01/2025", "14/01/2025", "12/01/2025",
]

const MOCK_CLIENTS: Client[] = Array.from({ length: 30 }, (_, i) => {
  const store = STORES[i % STORES.length]
  const amounts = [15000, 42500, 8700, 125000, 63200, 3500, 97800, 21000]

  return {
    id: `CLI-${String(1000 + i)}`,
    phone: PHONES[i % PHONES.length],
    firstName: FIRST_NAMES[i % FIRST_NAMES.length],
    lastName: LAST_NAMES[i % LAST_NAMES.length],
    store: store.name,
    storeCode: store.code,
    totalPurchases: amounts[i % amounts.length],
    transactionCount: ((i * 7 + 3) % 50) + 1,
    lastVisit: DATES[i % DATES.length],
    status: i % 5 === 0 ? "inactive" : "active",
  }
})

export const GET = withMiddleware(async (req: NextRequest) => {
  await randomDelay()

  const params = req.nextUrl.searchParams
  const page = Number(params.get("page") || "1")
  const limit = Number(params.get("limit") || "10")
  const search = params.get("search") || ""
  const quickFilter = params.get("quickFilter") || ""
  const status = params.get("status") || ""

  let filtered = MOCK_CLIENTS

  if (quickFilter) {
    filtered = filtered.filter((c) => c.storeCode === quickFilter)
  }

  if (status) {
    filtered = filtered.filter((c) => c.status === status)
  }

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (c) =>
        c.phone.includes(q) ||
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.store.toLowerCase().includes(q)
    )
  }

  return apiSuccess(paginate(filtered, page, limit))
})
