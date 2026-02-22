"use client"

import { useState } from "react"
import { GestionHeader } from "./GestionHeader"
import { EventsHistoryTab } from "./tabs/EventsHistoryTab"
import { UsersTab } from "./tabs/UsersTab"

type Tab = "users" | "history"

export function GestionContent() {
  const [activeTab, setActiveTab] = useState<Tab>("users")

  return (
    <div className="flex flex-col gap-5 lg:gap-[30px]">
      <h1 className="text-[22px] lg:text-[32px] font-bold tracking-[-0.66px] lg:tracking-[-0.96px] text-foreground">
        Gestions de l&apos;équipe
      </h1>

      <div className="overflow-hidden rounded-[20px] lg:rounded-[30px] bg-white">
        <div className="px-4 pt-4 lg:px-[30px] lg:pt-[24px]">
          <GestionHeader activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {activeTab === "users" ? <UsersTab /> : <EventsHistoryTab />}
      </div>
    </div>
  )
}
