import { create } from "zustand"

type StoreDetailStoreState = {
  storeName: string | null
  isLoading: boolean
  setStoreName: (name: string | null) => void
  setLoading: (loading: boolean) => void
}

export const useStoreDetailStore = create<StoreDetailStoreState>((set) => ({
  storeName: null,
  isLoading: false,
  setStoreName: (name) => set({ storeName: name }),
  setLoading: (loading) => set({ isLoading: loading }),
}))
