import { QueryClient } from "@tanstack/react-query";

export const tanstackQueryService = {
  queryClient: null as unknown as QueryClient,
  setQueryClient: (queryClient: QueryClient) => {
    tanstackQueryService.queryClient = queryClient;
  },
  invalidateQueries: (queryKey: string | string[]) => {
    tanstackQueryService.queryClient?.invalidateQueries({ queryKey: Array.isArray(queryKey) ? queryKey : [queryKey] });
  },
  invalidateQueriesByTag: (tag: string) => {
    tanstackQueryService.queryClient?.invalidateQueries({ tags: [tag] } as any);
  },
};