import { cookieService } from "@/services/cookie.service"
import { useCallback, useState } from "react"

const TAB_PREFIX = "table_tab_"

type UseTabPersistenceReturn = {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function useTabPersistence(
  defaultTab: string,
  persistKey?: string
): UseTabPersistenceReturn {
  const [activeTab, setActiveTabState] = useState<string>(() => {
    if (!persistKey) return defaultTab
    const saved = cookieService.getJSON<string>(`${TAB_PREFIX}${persistKey}`)
    return saved ?? defaultTab
  })

  const setActiveTab = useCallback(
    (tab: string) => {
      setActiveTabState(tab)
      if (persistKey) {
        cookieService.setJSON(`${TAB_PREFIX}${persistKey}`, tab, 30)
      }
    },
    [persistKey]
  )

  return { activeTab, setActiveTab }
}
