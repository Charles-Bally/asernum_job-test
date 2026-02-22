
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar"
import { SubNavBreadcrumb } from "@/components/dashboard/SubNavBreadcrumb"
import { SidebarProvider } from "@/components/sidebar_system"
import { NuqsAdapter } from "nuqs/adapters/next/app"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NuqsAdapter>
      <div className="min-h-dvh bg-surface-page">
        <div className="mx-auto max-w-[1370px] w-full pt-[26px]">
          <div className="relative z-10">
            <DashboardNavbar />
          </div>
          <SubNavBreadcrumb />
          <main className="mt-[30px]">{children}</main>
        </div>
      </div>
      <SidebarProvider />
    </NuqsAdapter>
  )
}
