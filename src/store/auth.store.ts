import { storageService } from "@/services/storage.service";
import { create } from "zustand";

type AuthStoreState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  checkAuth: () => void;
  setToken: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  token: null,

  checkAuth: () => {
    const token = storageService.getJSON<string>("auth:token");
    set({
      isAuthenticated: !!token,
      token,
      isLoading: false,
    });
  },

  setToken: (token: string) => {
    storageService.setJSON("auth:token", token);
    set({ isAuthenticated: true, token, isLoading: false });
  },

  logout: () => {
    storageService.clearAuthData();
    set({ isAuthenticated: false, token: null, isLoading: false });
  },
}));
