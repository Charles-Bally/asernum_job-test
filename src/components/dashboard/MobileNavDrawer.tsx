"use client"

import CustomImage from "@/components/ui/render/CustomImage"
import CustomLink from "@/components/ui/render/CustomLink"
import IMAGES from "@/constants/images.constant"
import { PATHNAME } from "@/constants/pathname.constant"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/auth.store"
import * as Dialog from "@radix-ui/react-dialog"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { AnimatePresence, motion, type PanInfo } from "framer-motion"
import { LogOut, User as UserIcon, X } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect } from "react"

type MobileNavDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  navItems: { label: string; href: string }[]
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const sheetVariants = {
  hidden: { y: "100%" },
  visible: { y: 0 },
  exit: { y: "100%" },
}

const transition = { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }

const DRAG_CLOSE_THRESHOLD = 80

export function MobileNavDrawer({ open, onOpenChange, navItems }: MobileNavDrawerProps) {
  const pathname = usePathname()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const displayName = user ? `${user.firstName} ${user.lastName}` : "Utilisateur"

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (info.offset.y > DRAG_CLOSE_THRESHOLD || info.velocity.y > 500) {
        onOpenChange(false)
      }
    },
    [onOpenChange]
  )

  const close = useCallback(() => onOpenChange(false), [onOpenChange])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const handleLogout = useCallback(() => {
    close()
    setTimeout(() => {
      logout()
      router.replace(PATHNAME.LOGIN)
    }, 350)
  }, [close, logout, router])

  const handleProfile = useCallback(() => {
    close()
    router.push("/dashboard/profil")
  }, [close, router])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal forceMount>
        <AnimatePresence mode="sync">
          {open && (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={transition}
                  className="fixed inset-0 z-40 bg-black/50"
                />
              </Dialog.Overlay>

              <Dialog.Content asChild>
                <motion.div
                  variants={sheetVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={transition}
                  drag="y"
                  dragDirectionLock
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0, bottom: 0.4 }}
                  onDragEnd={handleDragEnd}
                  className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col rounded-t-[24px] bg-white shadow-xl"
                >
                  <VisuallyHidden.Root>
                    <Dialog.Title>Menu de navigation</Dialog.Title>
                    <Dialog.Description>Navigation principale du tableau de bord</Dialog.Description>
                  </VisuallyHidden.Root>

                  {/* Drag handle */}
                  <div className="flex shrink-0 cursor-grab justify-center pt-3 pb-2 active:cursor-grabbing">
                    <div className="h-[5px] w-[48px] rounded-full bg-border-light" />
                  </div>

                  {/* Header */}
                  <div className="flex shrink-0 items-center justify-between px-6 pb-3">
                    <div className="w-[90px]">
                      <CustomImage config={IMAGES.logos.auchan} />
                    </div>
                    <Dialog.Close asChild>
                      <button className="cursor-pointer text-text-secondary hover:text-foreground">
                        <X size={22} />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* Nav links */}
                  <nav className="flex flex-1 mt-3 w-full flex-col gap-1 overflow-y-auto px-4 pb-2">
                    {navItems.map((item) => {
                      const isActive = pathname.startsWith(item.href)

                      return (
                        <div key={item.href} onClick={close}>
                          <CustomLink
                            href={item.href}
                            variant="none"
                            size="none"
                            containerClassName="w-full"
                            animation={false}
                            className={cn(
                              "block w-full rounded-[12px] px-4 py-3.5 text-[15px] font-bold tracking-[-0.45px] transition-colors",
                              isActive
                                ? "bg-auchan-red text-white"
                                : "text-foreground hover:bg-surface-muted"
                            )}
                          >
                            {item.label}
                          </CustomLink>
                        </div>
                      )
                    })}
                  </nav>

                  {/* Footer: user info + actions */}
                  <div className="shrink-0 border-t border-border-light px-5 py-4">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={handleProfile}
                        className="flex cursor-pointer items-center gap-3"
                      >
                        <div className="flex size-[36px] items-center justify-center rounded-full bg-surface-muted">
                          <UserIcon size={18} className="text-text-secondary" />
                        </div>
                        <span className="text-[14px] font-bold tracking-[-0.42px] text-foreground">
                          {displayName}
                        </span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="flex size-[36px] cursor-pointer items-center justify-center rounded-full bg-auchan-red-light text-auchan-red transition-colors hover:bg-auchan-red hover:text-white"
                        aria-label="Se déconnecter"
                      >
                        <LogOut size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
