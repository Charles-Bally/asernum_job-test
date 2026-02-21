import { NextRequest, NextResponse } from "next/server"
import { apiError } from "./response.helper"
import type { ApiContext, ApiMiddleware } from "./middleware.helper"

type FieldRule = {
  type: "string" | "number" | "boolean"
  required?: boolean
}

type ValidationSchema = Record<string, FieldRule>

export function validateBody(schema: ValidationSchema): ApiMiddleware {
  return async (req: NextRequest, context: ApiContext): Promise<NextResponse | void> => {
    let body: Record<string, any>

    try {
      body = await req.json()
    } catch {
      return apiError("Body JSON invalide", 400)
    }

    for (const [field, rule] of Object.entries(schema)) {
      const value = body[field]

      if (rule.required !== false && (value === undefined || value === null || value === "")) {
        return apiError(`Le champ "${field}" est requis`, 400)
      }

      if (value !== undefined && value !== null && typeof value !== rule.type) {
        return apiError(`Le champ "${field}" doit être de type ${rule.type}`, 400)
      }
    }

    context.body = body
  }
}
