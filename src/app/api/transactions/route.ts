import { randomDelay } from "@/app/api/_helpers/delay.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { paginate } from "@/app/api/_helpers/pagination.helper"
import { apiSuccess } from "@/app/api/_helpers/response.helper"
import type { NextRequest } from "next/server"

type TransactionRow = {
  id: string
  type: string
  store: string
  storeCode: string
  amount: number
  client: string | null
  date: string
}

const TYPES = ["Paiement course", "Rendu monnaie"] as const
const STORES = [
  { name: "Angré Djibi 1", code: "M0001" },
  { name: "Marcory Zone 4", code: "M0002" },
  { name: "Plateau Centre", code: "M0003" },
  { name: "Yopougon Selmer", code: "M0004" },
  { name: "Treichville Gare", code: "M0005" },
]
const CLIENTS = [
  "+225 07 63 32 22 32",
  "+225 01 02 03 04 05",
  "+225 05 06 07 08 09",
  "+225 07 08 06 05 04",
  "+225 09 12 34 56 78",
  null,
]
const DATES = [
  "20/01/2025, 10:20",
  "20/01/2025, 14:35",
  "19/01/2025, 09:10",
  "19/01/2025, 16:45",
  "18/01/2025, 11:20",
  "18/01/2025, 08:00",
  "17/01/2025, 15:30",
  "16/01/2025, 12:00",
]

const MOCK_TRANSACTIONS: TransactionRow[] = Array.from({ length: 45 }, (_, i) => {
  const store = STORES[i % STORES.length]
  const type = TYPES[i % TYPES.length]
  const amounts = [2500, 1800, 3200, 950, 4100, 600, 1250, 7500]
  const amount = type === "Rendu monnaie" ? -amounts[i % amounts.length] : amounts[i % amounts.length]

  return {
    id: String(10836745693 + i),
    type,
    store: store.name,
    storeCode: store.code,
    amount,
    client: CLIENTS[i % CLIENTS.length],
    date: DATES[i % DATES.length],
  }
})

function parseDate(dateStr: string): Date {
  const [datePart] = dateStr.split(",")
  const [day, month, year] = datePart.trim().split("/")
  return new Date(Number(year), Number(month) - 1, Number(day))
}

function parseDateParam(param: string): Date {
  const [day, month, year] = param.split("/")
  return new Date(Number(year), Number(month) - 1, Number(day))
}

export const GET = withMiddleware(async (req: NextRequest) => {
  await randomDelay()

  const params = req.nextUrl.searchParams
  const page = Number(params.get("page") || "1")
  const limit = Number(params.get("limit") || "10")
  const search = params.get("search") || ""
  const storeId = params.get("storeId") || ""
  const quickFilter = params.get("quickFilter") || ""
  const dateFrom = params.get("dateFrom") || ""
  const dateTo = params.get("dateTo") || ""

  let filtered = MOCK_TRANSACTIONS

  if (storeId) {
    filtered = filtered.filter((t) => t.storeCode === storeId)
  }

  if (quickFilter) {
    filtered = filtered.filter(
      (t) => t.type.toLowerCase() === quickFilter.toLowerCase()
    )
  }

  if (dateFrom && dateTo) {
    const from = parseDateParam(dateFrom)
    const to = parseDateParam(dateTo)
    filtered = filtered.filter((t) => {
      const d = parseDate(t.date)
      return d >= from && d <= to
    })
  }

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (t) =>
        t.id.includes(q) ||
        t.type.toLowerCase().includes(q) ||
        t.store.toLowerCase().includes(q) ||
        (t.client && t.client.includes(q))
    )
  }

  return apiSuccess(paginate(filtered, page, limit))
})
