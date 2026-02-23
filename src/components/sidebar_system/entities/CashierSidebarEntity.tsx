"use client"

import { SlidePanelLayout } from "@/components/menu/SlidePanelLayout"
import CustomButton from "@/components/ui/render/CustomButton"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { useSidebar } from "@/components/sidebar_system"
import { useToast } from "@/components/toast_system/hooks/useToast"
import { cashiersService } from "@/services/cashiers/cashiers.service"
import type { CashierTransaction, RecentTransaction, StoreHistory } from "@/services/cashiers/cashiers.types"
import { cn } from "@/lib/utils"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowLeft, Loader2 } from "lucide-react"
import type { SidebarComponentProps } from "../types/sidebar.types"

function StoreTimeline({ history }: { history: StoreHistory[] }) {
  if (history.length === 0) {
    return <p className="text-[13px] lg:text-[14px] text-text-secondary">Aucun historique disponible</p>
  }

  return (
    <div className="relative ml-1 mb-10 lg:mb-14 flex flex-col gap-5 lg:gap-[28px]">
      {history.length > 1 && (
        <div className="absolute left-[3px] top-[8px] h-[calc(100%-8px)] w-[1px] bg-border-light" />
      )}
      {history.map((entry, i) => (
        <div key={i} className="relative flex gap-3 lg:gap-[16px]">
          <div className="relative z-10 mt-[5px] size-[7px] shrink-0 rounded-full bg-auchan-red" />
          <div className="flex flex-col gap-1 lg:gap-[6px]">
            <p className="text-[14px] lg:text-[16px] font-bold tracking-[-0.42px] lg:tracking-[-0.48px] text-foreground">
              {entry.location}
            </p>
            <p className="text-[12px] lg:text-[14px] tracking-[-0.36px] lg:tracking-[-0.42px] text-text-secondary">
              {entry.period}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

function TransactionList({ transactions }: { transactions: RecentTransaction[] }) {
  if (transactions.length === 0) {
    return <p className="text-[13px] lg:text-[14px] text-text-secondary">Aucune transaction récente</p>
  }

  return (
    <div className="flex flex-col gap-1.5 lg:gap-[8px]">
      {transactions.map((tx, i) => (
        <div key={i} className="flex items-center justify-between">
          <span className="text-[14px] lg:text-[16px] font-bold tracking-[-0.42px] lg:tracking-[-0.48px] text-foreground">
            {tx.type}
          </span>
          <span className="text-[12px] lg:text-[14px] font-medium tracking-[-0.36px] lg:tracking-[-0.42px] text-foreground">
            {tx.amount}
          </span>
        </div>
      ))}
    </div>
  )
}

function AllTransactionsView({ cashierId, storeCode, onBack }: {
  cashierId: string
  storeCode?: string
  onBack: () => void
}) {
  const listRef = useRef<HTMLDivElement>(null)

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [...QUERY_KEYS.CASHIER_DETAIL, cashierId, "transactions", storeCode],
      queryFn: ({ pageParam = 1 }) =>
        cashiersService.getCashierTransactions(cashierId, {
          page: pageParam, limit: 15, ...(storeCode ? { storeCode } : {}),
        }),
      getNextPageParam: (last) => (last.page < last.totalPages ? last.page + 1 : undefined),
      initialPageParam: 1,
    })

  const handleScroll = useCallback(() => {
    const el = listRef.current
    if (!el || !hasNextPage || isFetching) return
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 60) fetchNextPage()
  }, [hasNextPage, isFetching, fetchNextPage])

  const allTx: CashierTransaction[] = data?.pages.flatMap((p) => p.rows) ?? []
  const total = data?.pages[0]?.total ?? 0

  return (
    <div className="flex h-full flex-col">
      <button onClick={onBack} className="mb-4 flex cursor-pointer items-center gap-2 text-text-secondary transition-colors hover:text-foreground">
        <ArrowLeft size={16} />
        <span className="text-[13px] font-medium">Retour</span>
      </button>

      <h3 className="mb-1 text-[17px] lg:text-[20px] font-bold tracking-[-0.51px] lg:tracking-[-0.6px] text-foreground">
        Toutes les transactions
      </h3>
      <p className="mb-4 text-[12px] text-text-secondary">{total} transaction{total > 1 ? "s" : ""}</p>

      <div ref={listRef} onScroll={handleScroll} className="-mx-2 flex-1 overflow-y-auto px-2">
        {isFetching && allTx.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={20} className="animate-spin text-text-secondary" />
          </div>
        ) : allTx.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-text-secondary">Aucune transaction</p>
        ) : (
          <div className="flex flex-col gap-2">
            {allTx.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between rounded-xl bg-surface-subtle px-3 py-2.5">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] lg:text-[14px] font-bold text-foreground">{tx.type}</span>
                  <span className="text-[11px] lg:text-[12px] text-text-secondary">{tx.date}</span>
                </div>
                <span className={cn(
                  "text-[13px] lg:text-[14px] font-semibold",
                  tx.amount.startsWith("+") ? "text-auchan-green" : "text-auchan-red"
                )}>
                  {tx.amount}
                </span>
              </div>
            ))}
            {isFetchingNextPage && (
              <div className="flex justify-center py-3">
                <Loader2 size={16} className="animate-spin text-text-secondary" />
              </div>
            )}
            {!hasNextPage && allTx.length > 0 && (
              <p className="py-3 text-center text-[11px] text-text-muted">Fin des transactions</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function CashierSidebarEntity({ config }: SidebarComponentProps) {
  const { close } = useSidebar()
  const { toast, TOAST } = useToast()
  const [showAll, setShowAll] = useState(false)

  const storeCode = config.params?.storeCode

  const { data: cashier, isLoading, isError } = useQuery({
    queryKey: [...QUERY_KEYS.CASHIER_DETAIL, config.entityId, storeCode],
    queryFn: () => cashiersService.getCashierById(config.entityId, storeCode),
    enabled: !!config.entityId,
    retry: false,
  })

  useEffect(() => {
    if (isError || (!isLoading && !cashier)) {
      close()
      toast({ type: TOAST.ERROR, message: "Le caissier que vous recherchez n'est pas disponible, veuillez réessayer." })
    }
  }, [isError, isLoading, cashier, close, toast, TOAST])

  if (isLoading) {
    return (
      <SlidePanelLayout title={<div className="h-[28px] lg:h-[32px] w-[160px] lg:w-[180px] animate-pulse rounded-[8px] lg:rounded-[10px] bg-surface-muted" />}>
        <div className="flex flex-col gap-3 lg:gap-[16px]">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-[36px] lg:h-[40px] animate-pulse rounded-[8px] lg:rounded-[10px] bg-surface-muted" />
          ))}
        </div>
      </SlidePanelLayout>
    )
  }

  if (!cashier) return null

  if (showAll) {
    return (
      <SlidePanelLayout
        title={<h2 className="text-[20px] lg:text-[24px] font-bold tracking-[-0.6px] lg:tracking-[-0.72px] text-foreground">{cashier.username}</h2>}
      >
        <AllTransactionsView cashierId={config.entityId} storeCode={storeCode} onBack={() => setShowAll(false)} />
      </SlidePanelLayout>
    )
  }

  return (
    <SlidePanelLayout
      title={
        <h2 className="text-[20px] lg:text-[24px] font-bold tracking-[-0.6px] lg:tracking-[-0.72px] text-foreground">
          {cashier.username}
        </h2>
      }
    >
      <h3 className="my-4 lg:my-[20px] text-[17px] lg:text-[20px] font-bold tracking-[-0.51px] lg:tracking-[-0.6px] text-foreground">
        Historique magasin
      </h3>
      <StoreTimeline history={cashier.storeHistory ?? []} />

      <div className="my-5 lg:my-[24px] h-px bg-border-light" />

      <h3 className="mb-3 lg:mb-[16px] text-[17px] lg:text-[20px] font-bold tracking-[-0.51px] lg:tracking-[-0.6px] text-foreground">
        Dernières transactions
      </h3>
      <TransactionList transactions={cashier.recentTransactions ?? []} />

      {(cashier.recentTransactions?.length ?? 0) > 0 && (
        <div className="mt-5 lg:mt-[24px] flex justify-center">
          <CustomButton variant="none" size="none" onClick={() => setShowAll(true)}
            className="flex h-[28px] lg:h-[30px] items-center rounded-[22px] bg-surface-muted px-5 lg:px-[24px] text-[13px] lg:text-[14px] font-bold tracking-[-0.39px] lg:tracking-[-0.42px] text-text-caption"
          >
            Toutes les transactions
          </CustomButton>
        </div>
      )}
    </SlidePanelLayout>
  )
}
