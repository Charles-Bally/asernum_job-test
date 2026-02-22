import { randomDelay } from "@/app/api/_helpers/delay.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { paginate } from "@/app/api/_helpers/pagination.helper"
import { apiSuccess } from "@/app/api/_helpers/response.helper"
import type { NextRequest } from "next/server"

type CashierRow = {
  id: string
  username: string
  accessKey: string
  showKey: boolean
  assignedDate: string
  status: "Actif" | "Bloqué"
}

const USERNAMES = [
  "OwenJaphet01",
  "KouameSerge",
  "TraoreAwa",
  "DialloBinta",
  "KoneIbrahim",
  "YaoKouadio",
  "CoulibalyFanta",
  "N'GuesanKoffi",
]

const DATES = [
  "20/01/2025, 10:20",
  "18/01/2025, 14:35",
  "15/01/2025, 09:10",
  "12/01/2025, 16:45",
  "10/01/2025, 11:20",
  "08/01/2025, 08:00",
  "05/01/2025, 15:30",
  "03/01/2025, 12:00",
]

const MOCK_CASHIERS: CashierRow[] = Array.from({ length: 30 }, (_, i) => ({
  id: `C${String(i + 1).padStart(4, "0")}`,
  username: USERNAMES[i % USERNAMES.length],
  accessKey: String(1000 + Math.floor(Math.random() * 9000)),
  showKey: false,
  assignedDate: DATES[i % DATES.length],
  status: i % 6 === 5 ? "Bloqué" : "Actif",
}))

export const GET = withMiddleware(async (req: NextRequest) => {
  await randomDelay()

  const params = req.nextUrl.searchParams
  const page = Number(params.get("page") || "1")
  const limit = Number(params.get("limit") || "10")
  const search = params.get("search") || ""
  const storeId = params.get("storeId") || ""
  const quickFilter = params.get("quickFilter") || ""

  let filtered = MOCK_CASHIERS

  if (storeId) {
    filtered = filtered.slice(0, 12 + (storeId.charCodeAt(4) % 10))
  }

  if (quickFilter) {
    filtered = filtered.filter(
      (c) => c.status.toLowerCase() === quickFilter.toLowerCase()
    )
  }

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (c) =>
        c.username.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
    )
  }

  return apiSuccess(paginate(filtered, page, limit))
})
