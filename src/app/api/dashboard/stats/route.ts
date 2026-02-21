
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiSuccess } from "@/app/api/_helpers/response.helper"
import type { NextRequest } from "next/server"

const STATS_BY_PERIOD: Record<string, { renduMonnaie: number; paiementCourse: number }> = {
  today: { renduMonnaie: 312, paiementCourse: 198 },
  "7days": { renduMonnaie: 2140, paiementCourse: 1560 },
  "30days": { renduMonnaie: 5618, paiementCourse: 3746 },
  year: { renduMonnaie: 42300, paiementCourse: 31200 },
}

export const GET = withMiddleware(async (req: NextRequest) => {
  const period = req.nextUrl.searchParams.get("period") || "30days"
  const stats = STATS_BY_PERIOD[period] ?? STATS_BY_PERIOD["30days"]

  return apiSuccess(stats)
})
