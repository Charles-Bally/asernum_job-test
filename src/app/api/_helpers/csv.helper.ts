import { NextResponse } from "next/server"

type CsvColumn<T> = {
  header: string
  key: keyof T | ((row: T) => string)
}

function escapeCell(value: string): string {
  if (value.includes('"') || value.includes(",") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((c) => escapeCell(c.header)).join(",")

  const lines = rows.map((row) =>
    columns
      .map((col) => {
        const raw =
          typeof col.key === "function"
            ? col.key(row)
            : String(row[col.key] ?? "")
        return escapeCell(raw)
      })
      .join(",")
  )

  return [header, ...lines].join("\r\n")
}

function csvResponse(csv: string, filename: string): NextResponse {
  const BOM = "\uFEFF"
  return new NextResponse(BOM + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  })
}

export { toCsv, csvResponse }
export type { CsvColumn }
