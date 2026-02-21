import jwt from "jsonwebtoken"
import type { JwtPayload, TokenPair } from "@/types/api.type"

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET!
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!

const ACCESS_EXPIRY = "15m"
const REFRESH_EXPIRY = "7d"
const RESET_EXPIRY = "10m"

function signAccessToken(payload: Omit<JwtPayload, "type">): string {
  return jwt.sign({ ...payload, type: "access" }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXPIRY,
  })
}

function signRefreshToken(payload: Omit<JwtPayload, "type">): string {
  return jwt.sign({ ...payload, type: "refresh" }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRY,
  })
}

function signResetToken(userId: string): string {
  return jwt.sign({ userId, type: "reset" }, ACCESS_SECRET, {
    expiresIn: RESET_EXPIRY,
  })
}

function verifyAccessToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as JwtPayload
    if (decoded.type !== "access") return null
    return decoded
  } catch {
    return null
  }
}

function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET) as JwtPayload
    if (decoded.type !== "refresh") return null
    return decoded
  } catch {
    return null
  }
}

function verifyResetToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as JwtPayload
    if (decoded.type !== "reset") return null
    return decoded
  } catch {
    return null
  }
}

function generateTokenPair(userId: string): TokenPair {
  return {
    accessToken: signAccessToken({ userId }),
    refreshToken: signRefreshToken({ userId }),
  }
}

export const jwtService = {
  signAccessToken,
  signRefreshToken,
  signResetToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyResetToken,
  generateTokenPair,
}
