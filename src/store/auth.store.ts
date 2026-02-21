import { storageService } from "@/services/storage.service";
import { create } from "zustand";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

type AuthStoreState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  user: AuthUser | null;
  checkAuth: () => void;
  setToken: (token: string) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  isAuthenticated: false,
  isLoading: true,
  token: null,
  user: null,

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

  setUser: (user: AuthUser) => {
    set({ user });
  },

  logout: () => {
    storageService.clearAuthData();
    set({ isAuthenticated: false, token: null, user: null, isLoading: false });
  },
}));
