
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar"
import { NavbarStickyWrapper } from "@/components/dashboard/NavbarStickyWrapper"
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
        {/* Sticky navbar + breadcrumb */}
        <NavbarStickyWrapper>
          <DashboardNavbar />
          <SubNavBreadcrumb />
        </NavbarStickyWrapper>

        <div className="mx-auto max-w-[1370px] w-full px-4 lg:px-0">
          <main className="mt-4 lg:mt-[30px] pb-6 lg:pb-10">{children}</main>
        </div>
      </div>
      <SidebarProvider />
    </NuqsAdapter>
  )
}
