"use client"

import { SlidePanelLayout } from "@/components/menu/SlidePanelLayout"
import CustomButton from "@/components/ui/render/CustomButton"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { useSidebar } from "@/components/sidebar_system"
import { useToast } from "@/components/toast_system/hooks/useToast"
import { cashiersService } from "@/services/cashiers/cashiers.service"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import type { SidebarComponentProps } from "../types/sidebar.types"

type StoreHistory = {
  location: string
  period: string
}

type RecentTransaction = {
  type: string
  amount: string
}

const MOCK_STORE_HISTORY: StoreHistory[] = [
  { location: "Zone 4, Abidjan", period: "Depuis le 20/01/2025" },
  { location: "Angré 8e Tranche", period: "Du 18/04/2024 au 30/08/2025" },
  { location: "II Plateaux Latrille", period: "Du 18/04/2024 au 30/08/2025" },
]

const MOCK_RECENT_TRANSACTIONS: RecentTransaction[] = [
  { type: "Paiement course", amount: "+2 500 FCFA" },
  { type: "Paiement course", amount: "+2 500 FCFA" },
  { type: "Rendu monnaie", amount: "-1 800 FCFA" },
  { type: "Paiement course", amount: "+2 500 FCFA" },
]

function StoreTimeline({ history }: { history: StoreHistory[] }) {
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
            <CustomButton
              variant="none"
              size="none"
              onClick={() => { }}
              className="mt-0.5 flex h-[26px] lg:h-[30px] w-fit items-center rounded-[22px] bg-surface-muted px-4 lg:px-[20px] text-[12px] lg:text-[14px] font-bold tracking-[-0.36px] lg:tracking-[-0.42px] text-text-caption"
            >
              Voir l&apos;activité
            </CustomButton>
          </div>
        </div>
      ))}
    </div>
  )
}

function TransactionList({ transactions }: { transactions: RecentTransaction[] }) {
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

  const { data: cashier, isLoading, isError } = useQuery({
    queryKey: [...QUERY_KEYS.CASHIER_DETAIL, config.entityId],
    queryFn: () => cashiersService.getCashierById(config.entityId),
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
      <StoreTimeline history={MOCK_STORE_HISTORY} />

      <div className="my-5 lg:my-[24px] h-px bg-border-light" />

      <h3 className="mb-3 lg:mb-[16px] text-[17px] lg:text-[20px] font-bold tracking-[-0.51px] lg:tracking-[-0.6px] text-foreground">
        Dernières transactions
      </h3>
      <TransactionList transactions={MOCK_RECENT_TRANSACTIONS} />

      <div className="mt-4 lg:mt-[20px] flex justify-center">
        <CustomButton
          variant="none"
          size="none"
          onClick={() => { }}
          className="flex h-[26px] lg:h-[30px] items-center rounded-[22px] bg-surface-muted px-5 lg:px-[24px] text-[12px] lg:text-[14px] font-bold tracking-[-0.36px] lg:tracking-[-0.42px] text-text-caption"
        >
          Toutes les transactions
        </CustomButton>
      </div>
    </SlidePanelLayout>
  )
}
