import { NextResponse } from "next/server"
import type { ApiResponse } from "@/types/api.type"

export function apiSuccess<T>(data: T, statusCode = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    { status: "success", data, error: null },
    { status: statusCode }
  )
}

export function apiError(message: string, statusCode = 400): NextResponse<ApiResponse<null>> {
  return NextResponse.json(
    { status: "error", data: null, error: message },
    { status: statusCode }
  )
}
