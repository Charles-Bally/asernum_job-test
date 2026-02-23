"use client"

import { SlidePanelLayout } from "@/components/menu/SlidePanelLayout"
import CustomButton from "@/components/ui/render/CustomButton"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { useSidebar } from "@/components/sidebar_system"
import { useToast } from "@/components/toast_system/hooks/useToast"
import { cashiersService } from "@/services/cashiers/cashiers.service"
import type { RecentTransaction, StoreHistory } from "@/services/cashiers/cashiers.types"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import type { SidebarComponentProps } from "../types/sidebar.types"

function StoreTimeline({ history }: { history: StoreHistory[] }) {
  if (history.length === 0) {
    return (
      <p className="text-[13px] lg:text-[14px] text-text-secondary">
        Aucun historique disponible
      </p>
    )
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
    return (
      <p className="text-[13px] lg:text-[14px] text-text-secondary">
        Aucune transaction récente
      </p>
    )
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

export function CashierSidebarEntity({ config }: SidebarComponentProps) {
  const { close } = useSidebar()
  const { toast, TOAST } = useToast()

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
    </SlidePanelLayout>
  )
}
