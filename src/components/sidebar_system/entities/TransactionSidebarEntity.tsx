"use client"

import { SlidePanelLayout } from "@/components/menu/SlidePanelLayout"
import CustomButton from "@/components/ui/render/CustomButton"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { cn } from "@/lib/utils"
import { transactionsService } from "@/services/transactions/transactions.service"
import { useQuery } from "@tanstack/react-query"
import { ArrowDownLeft, ArrowUpRight, Check, Copy } from "lucide-react"
import { useCallback, useState } from "react"
import type { SidebarComponentProps } from "../types/sidebar.types"

function formatAmount(amount: number): string {
  const abs = Math.abs(amount).toLocaleString("fr-FR")
  return amount >= 0 ? `+${abs} FCFA` : `-${abs} FCFA`
}

function TransactionTitle({ type, amount }: { type: string; amount: number }) {
  const isPositive = amount >= 0

  return (
    <div className="flex items-start gap-[14px]">
      <div
        className={cn(
          "flex size-[48px] shrink-0 items-center justify-center rounded-full",
          isPositive ? "bg-status-success/10" : "bg-auchan-red-light"
        )}
      >
        {isPositive ? (
          <ArrowDownLeft size={22} className="text-status-success" />
        ) : (
          <ArrowUpRight size={22} className="text-auchan-red" />
        )}
      </div>
      <div className="flex flex-col">
        <h2 className="text-[24px] font-bold tracking-[-0.72px] text-foreground">{type}</h2>
        <span
          className={cn(
            "text-[20px] font-bold tracking-[-0.6px]",
            isPositive ? "text-status-success" : "text-auchan-red"
          )}
        >
          {formatAmount(amount)}
        </span>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-[10px]">
      <span className="text-[14px] tracking-[-0.42px] text-text-secondary">{label}</span>
      <span className="text-[16px] font-bold tracking-[-0.48px] text-foreground">{value}</span>
    </div>
  )
}

export function TransactionSidebarEntity({ config }: SidebarComponentProps) {
  const [copied, setCopied] = useState(false)

  const { data: transaction, isLoading } = useQuery({
    queryKey: [...QUERY_KEYS.TRANSACTION_DETAIL, config.entityId],
    queryFn: () => transactionsService.getTransactionById(config.entityId),
    enabled: !!config.entityId,
  })

  const handleCopyId = useCallback(() => {
    if (!transaction) return
    navigator.clipboard.writeText(transaction.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [transaction])

  if (isLoading) {
    return (
      <SlidePanelLayout title={<div className="h-[48px] w-[200px] animate-pulse rounded-[12px] bg-surface-muted" />}>
        <div className="flex flex-col gap-[16px]">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-[40px] animate-pulse rounded-[10px] bg-surface-muted" />
          ))}
        </div>
      </SlidePanelLayout>
    )
  }

  if (!transaction) return null

  return (
    <SlidePanelLayout title={<TransactionTitle type={transaction.type} amount={transaction.amount} />}>
      <h3 className="mb-[12px] text-[20px] font-bold tracking-[-0.6px] text-foreground">
        Détails de la transaction
      </h3>

      <div className="flex flex-col divide-y divide-border-light rounded-[14px] bg-surface-muted px-[16px]">
        <div className="flex items-center justify-between py-[10px]">
          <span className="text-[14px] tracking-[-0.42px] text-text-secondary">ID Transaction</span>
          <div className="flex items-center gap-[8px]">
            <span className="font-mono text-[14px] font-bold tracking-[-0.42px] text-foreground">
              {transaction.id}
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              className="cursor-pointer text-text-secondary hover:text-foreground"
            >
              {copied ? <Check size={14} className="text-status-success" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
        <InfoRow label="Type" value={transaction.type} />
        <InfoRow label="Magasin" value={transaction.store} />
        <InfoRow label="Client" value={transaction.client ?? "N/A"} />
        <InfoRow label="Date" value={transaction.date} />
      </div>

      <div className="my-[24px] h-px bg-border-light" />

      <h3 className="mb-[12px] text-[20px] font-bold tracking-[-0.6px] text-foreground">Chronologie</h3>

      <div className="relative ml-[4px] flex flex-col gap-[20px]">
        <div className="absolute left-[3px] top-[8px] h-[calc(100%-8px)] w-[1px] bg-border-light" />
        {[
          { label: "Transaction initiée", time: transaction.date, color: "bg-auchan-red" },
          { label: "Validation en cours", time: transaction.date, color: "bg-yellow-400" },
          { label: "Transaction confirmée", time: transaction.date, color: "bg-auchan-green" },
        ].map((step, i) => (
          <div key={i} className="relative flex gap-[14px]">
            <div className={cn("relative z-10 mt-[6px] size-[7px] shrink-0 rounded-full", step.color)} />
            <div className="flex flex-col">
              <p className="text-[15px] font-bold tracking-[-0.45px] text-foreground">{step.label}</p>
              <p className="text-[13px] tracking-[-0.39px] text-text-secondary">{step.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-[24px] flex justify-center">
        <CustomButton
          variant="none"
          size="none"
          onClick={() => { }}
          className="flex h-[30px] items-center rounded-[22px] bg-surface-muted px-[24px] text-[14px] font-bold tracking-[-0.42px] text-text-caption"
        >
          Signaler un problème
        </CustomButton>
      </div>
    </SlidePanelLayout>
  )
}
