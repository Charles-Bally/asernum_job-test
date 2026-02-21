"use client"

import CustomImage from "@/components/ui/render/CustomImage"
import CustomLink from "@/components/ui/render/CustomLink"
import IMAGES from "@/constants/images.constant"
import { PATHNAME } from "@/constants/pathname.constant"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
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

  return (
    <nav className="flex h-[90px] w-full items-center rounded-[30px] bg-white pl-[36px] pr-[44px]">
      <CustomImage config={IMAGES.logos.auchan} />

      <div className="mx-auto flex items-center gap-[51px]">
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

      <UserMenu />
    </nav>
  )
}
