"use client"

import { SlidePanel } from "@/components/menu/SlidePanel"
import { useCallback, useEffect, useRef } from "react"
import { useSidebarURL } from "../hooks/useSidebarURL"
import { renderSidebar } from "../services/sidebarRenderer"
import { useSidebarStore } from "../store/useSidebar.store"

export function SidebarOutlet() {
  const { isOpen, config, inline } = useSidebarStore()
  const { pushToURL, clearURL } = useSidebarURL()
  const prevOpenRef = useRef(isOpen)

  useEffect(() => {
    const wasOpen = prevOpenRef.current
    prevOpenRef.current = isOpen

    if (isOpen && config && !wasOpen) {
      pushToURL(config.entity, config.entityId)
    } else if (!isOpen && wasOpen) {
      clearURL()
    }
  }, [isOpen, config, pushToURL, clearURL])

  const handleClose = useCallback(() => {
    useSidebarStore.getState().close()
  }, [])

  if (inline) return null

  const content = config ? renderSidebar(config) : null

  return (
    <SlidePanel open={isOpen} onClose={handleClose}>
      {content}
    </SlidePanel>
  )
}
