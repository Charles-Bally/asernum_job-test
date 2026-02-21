
export type PaginatedResult<T> = {
  rows: T[]
  total: number
  page: number
  totalPages: number
}

export function paginate<T>(items: T[], page: number, limit: number): PaginatedResult<T> {
  const total = items.length
  const totalPages = Math.ceil(total / limit)
  const safePage = Math.max(1, Math.min(page, totalPages || 1))
  const start = (safePage - 1) * limit
  const rows = items.slice(start, start + limit)

  return { rows, total, page: safePage, totalPages }
}
