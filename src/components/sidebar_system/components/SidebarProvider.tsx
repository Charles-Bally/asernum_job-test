"use client"

import { Suspense } from "react"
import { CashierSidebarEntity } from "../entities/CashierSidebarEntity"
import { TransactionSidebarEntity } from "../entities/TransactionSidebarEntity"
import { UserSidebarEntity } from "../entities/UserSidebarEntity"
import { registerSidebar } from "../services/sidebarRenderer"
import { SidebarOutlet } from "./SidebarOutlet"

registerSidebar("cashier-detail", CashierSidebarEntity)
registerSidebar("transaction-detail", TransactionSidebarEntity)
registerSidebar("user-detail", UserSidebarEntity)

export function SidebarProvider() {
  return (
    <Suspense fallback={null}>
      <SidebarOutlet />
    </Suspense>
  )
}
