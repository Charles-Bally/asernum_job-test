import { create } from "zustand"

type RefetchEntry = {
  refetch: () => void
}

type TableManagerState = {
  registry: Record<string, RefetchEntry>
  register: (key: string, refetch: () => void) => void
  unregister: (key: string) => void
  refetch: (key: string) => void
  refetchAll: () => void
}

export const useTableManagerStore = create<TableManagerState>((set, get) => ({
  registry: {},

  register: (key, refetch) => {
    set((state) => ({
      registry: { ...state.registry, [key]: { refetch } },
    }))
  },

  unregister: (key) => {
    set((state) => {
      const next = { ...state.registry }
      delete next[key]
      return { registry: next }
    })
  },

  refetch: (key) => {
    const entry = get().registry[key]
    entry?.refetch()
  },

  refetchAll: () => {
    const entries = Object.values(get().registry)
    entries.forEach((entry) => entry.refetch())
  },
}))
