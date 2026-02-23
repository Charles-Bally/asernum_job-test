
import { authMiddleware, requireRole } from "@/app/api/_helpers/auth.helper"
import { withMiddleware } from "@/app/api/_helpers/middleware.helper"
import { apiError, apiSuccess } from "@/app/api/_helpers/response.helper"
import { validateBody } from "@/app/api/_helpers/validate.helper"
import { prisma } from "@/services/api/prisma.service"
import type { NextRequest } from "next/server"

export const GET = withMiddleware(authMiddleware, requireRole("ADMIN"), async (req: NextRequest) => {
  const params = req.nextUrl.searchParams
  const page = Math.max(1, Number(params.get("page") || "1"))
  const limit = Math.max(1, Number(params.get("limit") || "15"))
  const search = params.get("search") || ""
  const commune = params.get("commune") || ""

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { code: { contains: search, mode: "insensitive" } },
      { ville: { contains: search, mode: "insensitive" } },
      { commune: { contains: search, mode: "insensitive" } },
    ]
  }

  if (commune) {
    where.commune = { equals: commune, mode: "insensitive" }
  }

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        manager: { select: { firstName: true, lastName: true } },
        responsableCaisses: { select: { firstName: true, lastName: true } },
        _count: { select: { cashiers: true, transactions: true } },
      },
    }),
    prisma.store.count({ where }),
  ])

  const rows = stores.map((s) => ({
    name: s.name,
    code: s.code,
    city: `${s.ville}, ${s.commune}`,
  }))

  const totalPages = Math.ceil(total / limit)

  return apiSuccess({ rows, total, page, totalPages })
})

export const POST = withMiddleware(
  authMiddleware,
  requireRole("ADMIN"),
  validateBody({
    name: { type: "string" },
    ville: { type: "string" },
    commune: { type: "string" },
    managerId: { type: "string" },
    responsableCaissesId: { type: "string" },
  }),
  async (_req, context) => {
    const body = context.body!
    const code = `MAG-${Date.now()}`

    const managerExists = await prisma.user.findUnique({
      where: { id: body.managerId },
    })
    if (!managerExists) {
      return apiError("Manager introuvable", 404)
    }

    const rcExists = await prisma.user.findUnique({
      where: { id: body.responsableCaissesId },
    })
    if (!rcExists) {
      return apiError("Responsable caisses introuvable", 404)
    }

    const cashierIds: string[] = body.cashierIds ?? []

    const store = await prisma.store.create({
      data: {
        name: body.name,
        code,
        ville: body.ville,
        commune: body.commune,
        quartier: body.quartier ?? null,
        managerId: body.managerId,
        responsableCaissesId: body.responsableCaissesId,
        cashiers: cashierIds.length
          ? { connect: cashierIds.map((id: string) => ({ id })) }
          : undefined,
      },
      include: {
        manager: { select: { firstName: true, lastName: true } },
        responsableCaisses: { select: { firstName: true, lastName: true } },
      },
    })

    return apiSuccess({ store, success: true }, 201)
  }
)
