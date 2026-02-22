
import type { ApiResponse } from "@/types/api.type"
import { http } from "@/services/http"

export async function fetchApi<T>(path: string): Promise<T> {
  const response = await http.get<ApiResponse<T>>(path)
  const json = response.data

  if (json.status === "error") throw new Error(json.error ?? "Erreur serveur")
  return json.data as T
}

export function buildQuery(params?: Record<string, string | number>): string {
  if (!params) return ""
  return new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== "")
      .map(([k, v]) => [k, String(v)])
  ).toString()
}
