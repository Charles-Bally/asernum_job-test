
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiSuccess } from "@/app/api/_helpers/response.helper"

const MOCK_STORES = [
  { name: "Angré Djibi 1", code: "M0001", city: "Abidjan, Cocody" },
  { name: "Angré Djibi 2", code: "M0002", city: "Abidjan, Cocody" },
  { name: "Marcory Zone 4", code: "M0003", city: "Abidjan, Marcory" },
  { name: "Plateau Centre", code: "M0004", city: "Abidjan, Plateau" },
  { name: "Yopougon Selmer", code: "M0005", city: "Abidjan, Yopougon" },
]

export const GET = withMiddleware(async () => {
  return apiSuccess({ stores: MOCK_STORES })
})
