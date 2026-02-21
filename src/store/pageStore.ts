import { create } from "zustand";

interface PageStoreState {
  loader: boolean;
  setLoading: (payload: boolean) => void;
}

export const usePageStore = create<PageStoreState>((set) => ({
  loader: false,
  setLoading: (payload: boolean) => {
    set(() => ({ loader: payload }));
  },
}));
