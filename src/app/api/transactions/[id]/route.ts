import { randomDelay } from "@/app/api/_helpers/delay.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import type { NextRequest } from "next/server"

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
]

export const GET = withMiddleware(async (req: NextRequest) => {
  await randomDelay()

  const id = req.nextUrl.pathname.split("/").pop() || ""
  const baseId = 10836745693
  const i = Number(id) - baseId

  if (Number.isNaN(i) || i < 0 || i >= 45) {
    return apiError("Transaction introuvable", 404)
  }

  const store = STORES[i % STORES.length]
  const type = TYPES[i % TYPES.length]
  const amounts = [2500, 1800, 3200, 950, 4100, 600, 1250, 7500]
  const amount = type === "Rendu monnaie" ? -amounts[i % amounts.length] : amounts[i % amounts.length]

  return apiSuccess({
    id: String(baseId + i),
    type,
    store: store.name,
    storeCode: store.code,
    amount,
    client: CLIENTS[i % CLIENTS.length],
    date: DATES[i % DATES.length],
  })
})
