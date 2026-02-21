
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { paginate } from "@/app/api/_helpers/pagination.helper"
import { apiSuccess } from "@/app/api/_helpers/response.helper"
import type { NextRequest } from "next/server"

type TransactionRow = {
  type: string
  store: string
  amount: number
  client: string | null
  date: string
}

const MOCK_TRANSACTIONS: TransactionRow[] = [
  { type: "Paiement course", store: "Angré Djibi 1", amount: 220, client: "+225 07 08 06 05 04", date: "20/01/2025, 10:20" },
  { type: "Rendu monnaie", store: "Angré Djibi 1", amount: -220, client: "+225 07 08 06 05 04", date: "20/01/2025, 10:20" },
  { type: "Rendu monnaie", store: "Angré Djibi 1", amount: 220, client: "+225 07 08 06 05 04", date: "20/01/2025, 10:20" },
  { type: "Paiement course", store: "Angré Djibi 1", amount: 220, client: "+225 07 08 06 05 04", date: "20/01/2025, 10:20" },
  { type: "Rendu monnaie", store: "Angré Djibi 1", amount: -220, client: null, date: "20/01/2025, 10:20" },
  { type: "Rendu monnaie", store: "Marcory Zone 4", amount: 220, client: "+225 07 08 06 05 04", date: "19/01/2025, 14:35" },
  { type: "Rendu monnaie", store: "Angré Djibi 1", amount: 220, client: "+225 07 08 06 05 04", date: "19/01/2025, 09:10" },
  { type: "Paiement course", store: "Plateau Centre", amount: 1500, client: "+225 01 02 03 04 05", date: "18/01/2025, 16:45" },
  { type: "Rendu monnaie", store: "Yopougon Selmer", amount: -350, client: "+225 05 06 07 08 09", date: "18/01/2025, 11:20" },
  { type: "Paiement course", store: "Angré Djibi 2", amount: 780, client: null, date: "17/01/2025, 08:00" },
]

export const GET = withMiddleware(async (req: NextRequest) => {
  const params = req.nextUrl.searchParams
  const page = Number(params.get("page") || "1")
  const limit = Number(params.get("limit") || "10")
  const search = params.get("search") || ""

  let filtered = MOCK_TRANSACTIONS

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (t) =>
        t.type.toLowerCase().includes(q) ||
        t.store.toLowerCase().includes(q) ||
        (t.client && t.client.includes(q))
    )
  }

  return apiSuccess(paginate(filtered, page, limit))
})
