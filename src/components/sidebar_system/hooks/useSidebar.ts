"use client"

import { useCallback } from "react"
import { useSidebarStore } from "../store/useSidebar.store"
import type { SidebarConfig } from "../types/sidebar.types"

export function useSidebar() {
  const { isOpen, config } = useSidebarStore()

  const open = useCallback((sidebarConfig: SidebarConfig) => {
    useSidebarStore.getState().open(sidebarConfig)
  }, [])

  const close = useCallback(() => {
    useSidebarStore.getState().close()
  }, [])

  return { isOpen, config, open, close }
}
