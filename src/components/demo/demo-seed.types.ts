export type SeedStatus = "idle" | "running" | "success" | "error"

export interface SeedProgress {
  currentStep: number
  totalSteps: number
  currentLabel: string
  status: SeedStatus
  error?: string
}

export interface WipeResponse {
  adminId: string
}

export interface UsersResponse {
  managers: { id: string }[]
  rcs: { id: string }[]
  cashiers: { id: string }[]
}

export interface StoresResponse {
  stores: { id: string; cashierIds: string[] }[]
}

export interface DataResponse {
  totalClients: number
  totalTx: number
}
