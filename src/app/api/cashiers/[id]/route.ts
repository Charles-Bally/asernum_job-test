import { randomDelay } from "@/app/api/_helpers/delay.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import type { NextRequest } from "next/server"

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

export const GET = withMiddleware(async (req: NextRequest) => {
  await randomDelay()

  const id = req.nextUrl.pathname.split("/").pop() || ""
  const match = id.match(/^C(\d+)$/)

  if (!match) return apiError("Caissier introuvable", 404)

  const i = Number(match[1]) - 1
  if (i < 0 || i >= 30) return apiError("Caissier introuvable", 404)

  return apiSuccess({
    id: `C${String(i + 1).padStart(4, "0")}`,
    username: USERNAMES[i % USERNAMES.length],
    accessKey: String(1000 + Math.floor(Math.random() * 9000)),
    showKey: i === 0,
    assignedDate: DATES[i % DATES.length],
    status: i % 6 === 5 ? "Bloqué" : "Actif",
  })
})
