"use client"

import { PATHNAME } from "@/constants/pathname.constant"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/auth.store"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { LogOut, User as UserIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

const ITEM_CLASS = cn(
  "flex cursor-pointer items-center gap-[10px] rounded-[10px] px-[14px] py-[10px]",
  "text-[14px] font-medium tracking-[-0.42px] text-foreground",
  "outline-none transition-colors data-[highlighted]:bg-surface-hover"
)

export function UserMenu() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const displayName = user
    ? `${user.firstName} ${user.lastName}`
    : "Utilisateur"

  const handleLogout = useCallback(() => {
    logout()
    router.replace(PATHNAME.LOGIN)
  }, [logout, router])

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex size-[36px] cursor-pointer items-center justify-center rounded-full bg-surface-muted outline-none transition-opacity hover:opacity-80"
          aria-label="Menu utilisateur"
        >
          <UserIcon size={18} className="text-text-secondary" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={12}
          align="end"
          className={cn(
            "z-50 min-w-[200px] rounded-[16px] bg-white p-[8px] shadow-lg",
            "animate-in fade-in slide-in-from-top-2 duration-200"
          )}
        >
          {/* User name */}
          <DropdownMenu.Label className="px-[14px] py-[10px] text-[14px] font-bold line-clamp-1 text-left tracking-[-0.42px] text-foreground">
            {displayName}
          </DropdownMenu.Label>

          <DropdownMenu.Separator className="mx-[8px] my-[4px] h-px bg-border-light" />

          {/* Mon profil */}
          <DropdownMenu.Item className={ITEM_CLASS} onSelect={() => router.push("/dashboard/profil")}>
            <UserIcon size={16} className="text-text-secondary" />
            Mon profil
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="mx-[8px] my-[4px] h-px bg-border-light" />

          {/* Se déconnecter */}
          <DropdownMenu.Item className={cn(ITEM_CLASS, "text-auchan-red data-[highlighted]:bg-auchan-red-light")} onSelect={handleLogout}>
            <LogOut size={16} />
            Se déconnecter
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
