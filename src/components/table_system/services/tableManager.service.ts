import { useTableManagerStore } from "../store/useTableManager.store"

export const tableManagerService = {
  refetch(key: string) {
    useTableManagerStore.getState().refetch(key)
  },

  refetchAll() {
    useTableManagerStore.getState().refetchAll()
  },

  register(key: string, refetch: () => void) {
    useTableManagerStore.getState().register(key, refetch)
  },

  unregister(key: string) {
    useTableManagerStore.getState().unregister(key)
  },
}
