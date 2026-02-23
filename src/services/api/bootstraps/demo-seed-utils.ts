export type Uid = { id: string }

export type StoreWithCashiers = { id: string; cashierIds: string[] }

export function accessKey(): string {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  return Array.from({ length: 4 }, () => c[Math.floor(Math.random() * c.length)]).join("")
}

export function phone(index: number): string {
  const base = 100000000 + index
  return `+2250${String(base).slice(0, 10)}`
}

export function txType(): "PAIEMENT_COURSE" | "RENDU_MONNAIE" {
  return Math.random() < 0.75 ? "PAIEMENT_COURSE" : "RENDU_MONNAIE"
}

export function amount(): number {
  const v = [500, 1000, 1500, 2000, 2500, 3000, 5000, 7500, 10000, 15000, 25000, 50000]
  return v[Math.floor(Math.random() * v.length)]
}

export function date30d(): Date {
  return new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 3600 * 1000))
}

export function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 3600 * 1000)
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
