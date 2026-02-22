
import { randomDelay } from "@/app/api/_helpers/delay.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { paginate } from "@/app/api/_helpers/pagination.helper"
import { apiSuccess } from "@/app/api/_helpers/response.helper"
import type { NextRequest } from "next/server"

type StoreRow = {
  name: string
  code: string
  city: string
}

const COMMUNES = ["Cocody", "Marcory", "Plateau", "Yopougon", "Treichville"]

const MOCK_STORES: StoreRow[] = Array.from({ length: 60 }, (_, i) => ({
  name: "Angré Djibi 1",
  code: `M${String(i + 1).padStart(4, "0")}`,
  city: `Abidjan, ${COMMUNES[i % COMMUNES.length]}`,
}))

export const GET = withMiddleware(async (req: NextRequest) => {
  await randomDelay()
  const params = req.nextUrl.searchParams
  const page = Number(params.get("page") || "1")
  const limit = Number(params.get("limit") || "15")
  const search = params.get("search") || ""
  const commune = params.get("commune") || ""

  let filtered = MOCK_STORES

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q)
    )
  }

  if (commune) {
    filtered = filtered.filter((s) =>
      s.city.toLowerCase().includes(commune.toLowerCase())
    )
  }

  return apiSuccess({ ...paginate(filtered, page, limit), communes: COMMUNES })
})
