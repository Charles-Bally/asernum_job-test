"use client"

import CustomImage from "@/components/ui/render/CustomImage"
import CustomLink from "@/components/ui/render/CustomLink"
import IMAGES from "@/constants/images.constant"
import { PATHNAME } from "@/constants/pathname.constant"
import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { MobileNavDrawer } from "./MobileNavDrawer"
import { UserMenu } from "./UserMenu"

const NAV_ITEMS = [
  { label: "Tableau de bord", href: PATHNAME.DASHBOARD.home },
  { label: "Magasins", href: PATHNAME.DASHBOARD.store.listing },
  { label: "Transactions", href: PATHNAME.DASHBOARD.transactions },
  { label: "Clients", href: PATHNAME.DASHBOARD.clients },
  { label: "Gestions", href: PATHNAME.DASHBOARD.gestions },
  { label: "Statistiques", href: PATHNAME.DASHBOARD.statistiques },
]

export function DashboardNavbar() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <nav className="relative z-20 flex h-[56px] lg:h-[90px] w-full items-center rounded-[16px] lg:rounded-[30px] bg-white px-4 lg:pl-[36px] lg:pr-[44px]">
        <CustomLink href={PATHNAME.DASHBOARD.home} variant="none" size="none" animation={false}>
          <div className="w-[90px] lg:w-[120px]">
            <CustomImage config={IMAGES.logos.auchan} />
          </div>
        </CustomLink>

        <div className="mx-auto hidden lg:flex items-center gap-[51px]">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href)

            return (
              <CustomLink
                key={item.href}
                href={item.href}
                variant="none"
                size="none"
                animation={false}
                className={cn(
                  "text-[18px] font-bold tracking-[-0.54px] transition-all duration-200 ease-in-out",
                  isActive
                    ? "rounded-[10px] bg-auchan-red px-4 py-2 text-white"
                    : "text-foreground hover:text-auchan-red"
                )}
              >
                {item.label}
              </CustomLink>
            )
          })}
        </div>

        <div className="hidden lg:block">
          <UserMenu />
        </div>

        <button
          onClick={() => setDrawerOpen(true)}
          className="ml-auto cursor-pointer lg:hidden text-foreground"
          aria-label="Ouvrir le menu"
        >
          <Menu size={24} />
        </button>
      </nav>

      <MobileNavDrawer open={drawerOpen} onOpenChange={setDrawerOpen} navItems={NAV_ITEMS} />
    </>
  )
}
