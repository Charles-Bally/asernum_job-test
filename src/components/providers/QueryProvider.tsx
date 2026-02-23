"use client";

import { tanstackQueryService } from "@/services/tanstack-query.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);

  // eslint-disable-next-line react-hooks/refs
  if (!initialized.current) {
    tanstackQueryService.setQueryClient(queryClient);
    initialized.current = true;
  }

  useEffect(() => {
    tanstackQueryService.setQueryClient(queryClient);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
