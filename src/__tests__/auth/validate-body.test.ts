import { validateBody } from "@/app/api/_helpers/validate.helper"
import type { ApiContext } from "@/app/api/_helpers/middleware.helper"
import { NextRequest } from "next/server"
import { describe, expect, it } from "vitest"

function createRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

const loginSchema = {
  identifier: { type: "string" as const, required: true },
  password: { type: "string" as const, required: true },
}

describe("validateBody — middleware de validation", () => {
  it("passe si tous les champs requis sont fournis", async () => {
    const req = createRequest({ identifier: "test@auchan.ci", password: "secret123" })
    const ctx: ApiContext = {}
    const middleware = validateBody(loginSchema)

    const result = await middleware(req, ctx)

    expect(result).toBeUndefined()
    expect(ctx.body).toEqual({ identifier: "test@auchan.ci", password: "secret123" })
  })

  it("rejette si identifier est manquant", async () => {
    const req = createRequest({ password: "secret123" })
    const ctx: ApiContext = {}
    const middleware = validateBody(loginSchema)

    const result = await middleware(req, ctx)
    const json = await result!.json()

    expect(result!.status).toBe(400)
    expect(json.error).toContain("identifier")
    expect(json.error).toContain("requis")
  })

  it("rejette si password est manquant", async () => {
    const req = createRequest({ identifier: "test@auchan.ci" })
    const ctx: ApiContext = {}
    const middleware = validateBody(loginSchema)

    const result = await middleware(req, ctx)
    const json = await result!.json()

    expect(result!.status).toBe(400)
    expect(json.error).toContain("password")
  })

  it("rejette si un champ est une string vide", async () => {
    const req = createRequest({ identifier: "", password: "secret" })
    const ctx: ApiContext = {}
    const middleware = validateBody(loginSchema)

    const result = await middleware(req, ctx)
    const json = await result!.json()

    expect(result!.status).toBe(400)
    expect(json.error).toContain("identifier")
  })

  it("rejette si le type est incorrect", async () => {
    const req = createRequest({ identifier: 12345, password: "secret" })
    const ctx: ApiContext = {}
    const middleware = validateBody(loginSchema)

    const result = await middleware(req, ctx)
    const json = await result!.json()

    expect(result!.status).toBe(400)
    expect(json.error).toContain("type")
  })

  it("rejette si le body JSON est invalide", async () => {
    const req = new NextRequest("http://localhost/api/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json{{{",
    })
    const ctx: ApiContext = {}
    const middleware = validateBody(loginSchema)

    const result = await middleware(req, ctx)
    const json = await result!.json()

    expect(result!.status).toBe(400)
    expect(json.error).toContain("JSON invalide")
  })
})
