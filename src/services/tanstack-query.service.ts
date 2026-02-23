import { QueryClient } from "@tanstack/react-query";

/**
 * Pont pour accéder au QueryClient hors React.
 * Stocké sur window pour survivre à la duplication de modules Turbopack.
 */
export const tanstackQueryService = {
  setQueryClient: (queryClient: QueryClient) => {
    if (typeof window !== "undefined") {
      (window as any).__QUERY_CLIENT__ = queryClient;
    }
  },
  getQueryClient: (): QueryClient | null => {
    if (typeof window !== "undefined") {
      return (window as any).__QUERY_CLIENT__ ?? null;
    }
    return null;
  },
  invalidateQueries: async (queryKey: string | string[]) => {
    const qc = tanstackQueryService.getQueryClient();
    if (!qc) return;
    const key = Array.isArray(queryKey) ? queryKey : [queryKey];
    await qc.invalidateQueries({ queryKey: key });
  },
};