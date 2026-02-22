"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef } from "react"
import { useSidebarStore } from "../store/useSidebar.store"
import type { SidebarEntity } from "../types/sidebar.types"

const PARAM_SIDEBAR = "sidebar"
const PARAM_SIDEBAR_ID = "sidebarId"

function buildCleanURL(pathname: string, searchParams: URLSearchParams) {
  const params = new URLSearchParams(searchParams.toString())
  params.delete(PARAM_SIDEBAR)
  params.delete(PARAM_SIDEBAR_ID)
  const qs = params.toString()
  return qs ? `${pathname}?${qs}` : pathname
}

export function useSidebarURL() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const mountedRef = useRef(false)

  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true

    const entity = searchParams.get(PARAM_SIDEBAR)
    const entityId = searchParams.get(PARAM_SIDEBAR_ID)

    if (entity && entityId) {
      useSidebarStore.getState().open({
        entity: entity as SidebarEntity,
        entityId,
      })
    }
  }, [searchParams])

  useEffect(() => {
    const handlePopState = () => {
      const url = new URL(window.location.href)
      const entity = url.searchParams.get(PARAM_SIDEBAR)
      const entityId = url.searchParams.get(PARAM_SIDEBAR_ID)

      if (entity && entityId) {
        useSidebarStore.getState().open({
          entity: entity as SidebarEntity,
          entityId,
        })
      } else {
        useSidebarStore.getState().close()
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const pushToURL = useCallback(
    (entity: string, entityId: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(PARAM_SIDEBAR, entity)
      params.set(PARAM_SIDEBAR_ID, entityId)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  const clearURL = useCallback(() => {
    router.push(buildCleanURL(pathname, searchParams), { scroll: false })
  }, [router, pathname, searchParams])

  return { pushToURL, clearURL }
}
