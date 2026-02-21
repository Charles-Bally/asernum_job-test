"use client"

import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh bg-surface-page">
      <div className="mx-auto max-w-[1370px] w-full pt-[26px]">
        <DashboardNavbar />
        <main className="mt-[30px]">{children}</main>
      </div>
    </div>
  )
}
