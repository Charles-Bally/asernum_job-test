
import { authMiddleware, requireRole } from "@/app/api/_helpers/auth.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiSuccess } from "@/app/api/_helpers/response.helper"
import { prisma } from "@/services/api/prisma.service"

export const GET = withMiddleware(authMiddleware, requireRole("ADMIN"), async () => {
  const communes = await prisma.store.groupBy({
    by: ["commune"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 10,
  })

  return apiSuccess(communes.map((c) => c.commune))
})
