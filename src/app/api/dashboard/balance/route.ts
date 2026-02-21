
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiSuccess } from "@/app/api/_helpers/response.helper"

export const GET = withMiddleware(async () => {
  return apiSuccess({ balance: 9231000 })
})
