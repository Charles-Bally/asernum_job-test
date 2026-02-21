
"use client"

import { parseAsInteger, useQueryState } from "nuqs"
import { useCallback } from "react"

type UseListingParamsOptions = {
  searchKey?: string
  pageKey?: string
}

export function useListingParams(options?: UseListingParamsOptions) {
  const searchKey = options?.searchKey ?? "q"
  const pageKey = options?.pageKey ?? "page"

  const [search, rawSetSearch] = useQueryState(searchKey, { defaultValue: "" })
  const [page, rawSetPage] = useQueryState(pageKey, parseAsInteger.withDefault(1))

  const setSearch = useCallback(
    (value: string) => {
      rawSetSearch(value)
      rawSetPage(1)
    },
    [rawSetSearch, rawSetPage]
  )

  const setPage = useCallback(
    (value: number) => rawSetPage(value),
    [rawSetPage]
  )

  const withPageReset = useCallback(
    <T,>(setter: (value: T) => void) => (value: T) => {
      setter(value)
      rawSetPage(1)
    },
    [rawSetPage]
  )

  return { search, setSearch, page, setPage, withPageReset }
}
