import { create } from "zustand"
import type { SidebarConfig, SidebarStore } from "../types/sidebar.types"

export const useSidebarStore = create<SidebarStore>((set) => ({
  config: null,
  isOpen: false,
  inline: false,

  open: (config: SidebarConfig) => {
    set({ config, isOpen: true })
  },

  close: () => {
    set({ isOpen: false })
  },

  setInline: (inline: boolean) => {
    set({ inline })
  },
}))
