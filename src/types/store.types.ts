export type CreateStorePayload = {
  name: string
  ville: string
  commune: string
  quartier?: string
  managerId: string
  responsableCaissesId: string
  cashierIds: string[]
}
