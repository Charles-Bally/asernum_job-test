
import { randomDelay } from "@/app/api/_helpers/delay.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiSuccess } from "@/app/api/_helpers/response.helper"

export const GET = withMiddleware(async () => {
  await randomDelay()
  return apiSuccess({ balance: 9231000 })
})
