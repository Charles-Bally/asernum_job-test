import { NextRequest, NextResponse } from "next/server"

export type ApiContext = {
  userId?: string
  body?: Record<string, any>
  [key: string]: any
}

export type ApiMiddleware = (
  req: NextRequest,
  context: ApiContext
) => Promise<NextResponse | void>

export type ApiHandler = (
  req: NextRequest,
  context: ApiContext
) => Promise<NextResponse>

export function withMiddleware(...middlewares: (ApiMiddleware | ApiHandler)[]) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const context: ApiContext = {}

    for (const middleware of middlewares) {
      const result = await middleware(req, context)
      if (result instanceof NextResponse) return result
    }

    return NextResponse.json(
      { status: "error", data: null, error: "No handler responded" },
      { status: 500 }
    )
  }
}
