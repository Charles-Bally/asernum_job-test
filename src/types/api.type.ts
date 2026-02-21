export type ApiResponse<T = any> = {
  status: "success" | "error"
  data: T | null
  error: string | null
}

export type JwtPayload = {
  userId: string
  type: "access" | "refresh" | "reset"
}

export type TokenPair = {
  accessToken: string
  refreshToken: string
}
