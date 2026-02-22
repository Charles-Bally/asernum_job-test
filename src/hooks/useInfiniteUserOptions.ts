import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { usersService } from "@/services/users/users.service"
import type { DropdownOption } from "@/components/ui/forms/InputDropdown"
import type { UserRole } from "@/types/user.types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useCallback, useMemo, useState } from "react"

const PAGE_SIZE = 10

export function useInfiniteUserOptions(role: UserRole) {
  const [search, setSearch] = useState("")

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [...QUERY_KEYS.USERS, "role", role, "search", search],
      queryFn: ({ pageParam = 1 }) =>
        usersService.getUsers({ role, search, page: pageParam, limit: PAGE_SIZE }),
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
      initialPageParam: 1,
    })

  const options: DropdownOption[] = useMemo(() => {
    if (!data) return []
    const seen = new Set<string>()
    return data.pages.flatMap((page) =>
      page.rows
        .filter((u) => { if (seen.has(u.id)) return false; seen.add(u.id); return true })
        .map((u) => ({ value: u.id, label: `${u.firstName} ${u.lastName}` }))
    )
  }, [data])

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return {
    options,
    onSearch: setSearch,
    onLoadMore: handleLoadMore,
    isLoading: isFetching,
    hasMore: !!hasNextPage,
  }
}
