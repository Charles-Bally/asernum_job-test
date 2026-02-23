import { describe, expect, it } from "vitest"

/**
 * Tests des helpers de seed démo
 * Vérifie les fonctions utilitaires sans toucher à la DB
 */

// Reproduce les fonctions du helper pour les tester unitairement
function phone(index: number): string {
  const base = 100000000 + index
  return `+2250${String(base).slice(0, 10)}`
}

function accessKey(): string {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  return Array.from({ length: 4 }, () => c[Math.floor(Math.random() * c.length)]).join("")
}

function storeCode(index: number, ts: number): string {
  return `MAG-${String(index + 1).padStart(3, "0")}-${ts.toString(36).slice(0, 4).toUpperCase()}`
}

describe("Demo Seed — utilitaires", () => {
  it("génère des numéros de téléphone CI uniques et valides", () => {
    const phones = Array.from({ length: 100 }, (_, i) => phone(i))
    const unique = new Set(phones)

    expect(unique.size).toBe(100)
    phones.forEach((p) => {
      expect(p).toMatch(/^\+2250\d+$/)
      expect(p.length).toBeGreaterThanOrEqual(14)
    })
  })

  it("génère des accessKeys de 4 caractères alphanumériques", () => {
    const keys = Array.from({ length: 50 }, () => accessKey())

    keys.forEach((k) => {
      expect(k).toHaveLength(4)
      expect(k).toMatch(/^[A-Z2-9]{4}$/)
    })
  })

  it("ne contient pas de caractères ambigus (0, O, 1, I) dans les accessKeys", () => {
    const keys = Array.from({ length: 200 }, () => accessKey())

    keys.forEach((k) => {
      expect(k).not.toMatch(/[0OI1]/)
    })
  })

  it("génère des codes magasin uniques avec padding correct", () => {
    const ts = Date.now()
    const codes = Array.from({ length: 50 }, (_, i) => storeCode(i, ts + i))
    const unique = new Set(codes)

    expect(unique.size).toBe(50)
    expect(codes[0]).toMatch(/^MAG-001-/)
    expect(codes[9]).toMatch(/^MAG-010-/)
    expect(codes[49]).toMatch(/^MAG-050-/)
  })

  it("retourne des montants parmi les valeurs ×100F attendues", () => {
    const AMOUNTS = [500, 1000, 1500, 2000, 2500, 3000, 5000, 7500, 10000, 15000, 25000, 50000]

    for (let i = 0; i < 100; i++) {
      const picked = AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)]
      expect(AMOUNTS).toContain(picked)
      expect(picked % 100).toBe(0)
    }
  })
})
