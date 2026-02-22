import { randomDelay } from "@/app/api/_helpers/delay.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiSuccess } from "@/app/api/_helpers/response.helper"
import type { NextRequest } from "next/server"

type StoreDetailRow = {
  id: string
  name: string
  code: string
  city: string
  manager: string
  responsableCaisse: string
  nbCaissiers: number
  nbTransactions: number
  stats: { renduMonnaie: number; paiementCourse: number }
}

const MOCK_STORE_DETAILS: Record<string, StoreDetailRow> = Object.fromEntries(
  Array.from({ length: 60 }, (_, i) => {
    const code = `M${String(i + 1).padStart(4, "0")}`
    const communes = ["Cocody", "Marcory", "Plateau", "Yopougon", "Treichville"]
    return [
      code,
      {
        id: code,
        name: "Angré Djibi 1",
        code,
        city: `Abidjan, ${communes[i % communes.length]}`,
        manager: "Kouassi Jean-Marc",
        responsableCaisse: "Touré Aminata",
        nbCaissiers: 12 + (i % 8),
        nbTransactions: 1200 + i * 30,
        stats: { renduMonnaie: 35, paiementCourse: 65 },
      },
    ]
  })
)

export const GET = withMiddleware(async (req: NextRequest) => {
  await randomDelay()
  const id = req.nextUrl.pathname.split("/").pop() || ""
  const store = MOCK_STORE_DETAILS[id]

  if (!store) {
    return apiSuccess(null)
  }

  return apiSuccess(store)
})
