import { http } from "@/services/http"

async function downloadCsv(
  endpoint: string,
  params?: Record<string, string | undefined>,
  filename?: string
): Promise<void> {
  const cleanParams = new URLSearchParams()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value) cleanParams.set(key, value)
    }
  }

  const query = cleanParams.toString()
  const url = query ? `${endpoint}?${query}` : endpoint

  const response = await http.get(url, { responseType: "blob" })

  const blob = new Blob([response.data], { type: "text/csv;charset=utf-8" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = filename ?? "export.csv"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

export { downloadCsv }
