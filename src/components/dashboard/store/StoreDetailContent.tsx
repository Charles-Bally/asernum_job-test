
"use client"

import { useModal } from "@/components/modal_system"
import { useSidebar } from "@/components/sidebar_system"
import { useSidebarStore } from "@/components/sidebar_system/store/useSidebar.store"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useStoreDetailQuery } from "@/hooks/useStoreDetailController"
import type { CashierRow } from "@/services/cashiers/cashiers.types"
import type { TransactionRow } from "@/services/transactions/transactions.types"
import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useEffect, useState } from "react"
import { InlineSidebarPanel } from "./InlineSidebarPanel"
import { StoreCashiersTable } from "./StoreCashiersTable"
import { StoreDetailHeader } from "./StoreDetailHeader"
import { StoreDetailTabs, type StoreTab } from "./StoreDetailTabs"
import { StoreInfoCard } from "./StoreInfoCard"
import { StoreInfoCardSkeleton } from "./StoreInfoCardSkeleton"
import { StoreTransactionsTable } from "./StoreTransactionsTable"

type StoreDetailContentProps = {
  id: string
}

export function StoreDetailContent({ id }: StoreDetailContentProps) {
  const { store, isLoading } = useStoreDetailQuery(id)
  const [activeTab, setActiveTab] = useState<StoreTab>("transactions")
  const modal = useModal()

  const sidebar = useSidebar()
  const isXl = useMediaQuery("(min-width: 1280px)")
  const { isOpen, config, setInline, close } = useSidebarStore()

  const handleTabChange = useCallback(
    (tab: StoreTab) => {
      close()
      setActiveTab(tab)
    },
    [close]
  )

  useEffect(() => {
    setInline(isXl)
    return () => setInline(false)
  }, [isXl, setInline])

  useEffect(() => {
    return () => close()
  }, [close])

  const handleCashierClick = useCallback(
    (cashier: CashierRow) => {
      sidebar.open({ entity: "cashier-detail", entityId: cashier.id })
    },
    [sidebar]
  )

  const handleTransactionClick = useCallback(
    (transaction: TransactionRow) => {
      sidebar.open({ entity: "transaction-detail", entityId: transaction.id })
    },
    [sidebar]
  )

  const handleEditStore = useCallback(() => {
    if (!store) return
    modal.open({
      entity: "edit-store",
      entityId: store.code,
      mode: "edit",
      layout: "wizard",
      size: "md",
    })
  }, [modal, store])

  return (
    <div className="flex">
      <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-[28px] ">
        <StoreDetailHeader />

        {isLoading ? (
          <StoreInfoCardSkeleton />
        ) : store ? (
          <StoreInfoCard store={store} onEdit={handleEditStore} />
        ) : null}

        <div className="overflow-hidden rounded-[16px] lg:rounded-[20px] bg-white">
          <div className="px-4 pt-4 lg:px-[30px] lg:pt-[24px]">
            <StoreDetailTabs activeTab={activeTab} onTabChange={handleTabChange} />
          </div>

          {activeTab === "transactions" && (
            <StoreTransactionsTable storeId={id} onRowClick={handleTransactionClick} />
          )}

          {activeTab === "caissiers" && (
            <StoreCashiersTable storeId={id} onRowClick={handleCashierClick} />
          )}
        </div>
      </div>

      <AnimatePresence>
        {isXl && isOpen && config && (
          <motion.div
            key="inline-sidebar"
            initial={{ opacity: 0, width: 0, marginLeft: "0px" }}
            animate={{ opacity: 1, width: 386, marginLeft: "20px" }}
            exit={{ opacity: 0, width: 0, marginLeft: "0px" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="shrink-0 overflow-x-clip"
          >
            <InlineSidebarPanel config={config} onClose={close} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
