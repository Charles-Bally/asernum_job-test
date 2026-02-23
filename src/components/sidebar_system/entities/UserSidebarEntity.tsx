"use client"

import { SlidePanelLayout } from "@/components/menu/SlidePanelLayout"
import { useSidebar } from "@/components/sidebar_system"
import { useToast } from "@/components/toast_system/hooks/useToast"
import InputDropdown from "@/components/ui/forms/InputDropdown"
import InputText from "@/components/ui/forms/InputText"
import CustomButton from "@/components/ui/render/CustomButton"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { useUserActions } from "@/hooks/useGestionController"
import { cn } from "@/lib/utils"
import { usersService } from "@/services/users/users.service"
import { useAuthStore } from "@/store/auth.store"
import type { UserRole } from "@/types/user.types"
import { USER_ROLE_LABELS } from "@/types/user.types"
import { useQuery } from "@tanstack/react-query"
import { Lock, Pencil, RotateCcw, Unlock, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import type { SidebarComponentProps } from "../types/sidebar.types"

const ROLE_OPTIONS = Object.entries(USER_ROLE_LABELS).map(([value, label]) => ({ value, label }))

function UserAvatar({ firstName, lastName }: { firstName: string; lastName: string }) {
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase()
  return (
    <div className="flex size-[48px] lg:size-[56px] shrink-0 items-center justify-center rounded-full bg-auchan-red">
      <span className="text-[18px] lg:text-[22px] font-bold text-white">{initials}</span>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 lg:py-[10px]">
      <span className="shrink-0 whitespace-nowrap text-[13px] lg:text-[14px] tracking-[-0.39px] lg:tracking-[-0.42px] text-text-secondary">{label}</span>
      <span className="text-[14px] lg:text-[16px] font-bold tracking-[-0.42px] lg:tracking-[-0.48px] text-foreground text-right break-all line-clamp-1">{value}</span>
    </div>
  )
}

export function UserSidebarEntity({ config }: SidebarComponentProps) {
  const actions = useUserActions()
  const { close } = useSidebar()
  const { toast, TOAST } = useToast()
  const currentUserId = useAuthStore((s) => s.user?.id)
  const isSelf = currentUserId === config.entityId
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", role: "" as UserRole })

  const { data: user, isLoading, isError } = useQuery({
    queryKey: [...QUERY_KEYS.USER_DETAIL, config.entityId],
    queryFn: () => usersService.getUserById(config.entityId),
    enabled: !!config.entityId,
    retry: false,
  })

  useEffect(() => {
    if (isError || (!isLoading && !user)) {
      close()
      toast({ type: TOAST.ERROR, message: "L'utilisateur que vous recherchez n'est pas disponible, veuillez réessayer." })
    }
  }, [isError, isLoading, user, close, toast, TOAST])

  const startEdit = useCallback(() => {
    if (!user) return
    setForm({ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role })
    setEditing(true)
  }, [user])

  const cancelEdit = useCallback(() => setEditing(false), [])

  const saveEdit = useCallback(async () => {
    if (!user) return
    const payload: Record<string, string> = {}
    if (form.firstName !== user.firstName) payload.firstName = form.firstName
    if (form.lastName !== user.lastName) payload.lastName = form.lastName
    if (form.email !== user.email) payload.email = form.email
    if (form.role !== user.role) payload.role = form.role

    if (Object.keys(payload).length === 0) {
      setEditing(false)
      return
    }
    const result = await actions.updateUser(user.id, payload)
    if (result) setEditing(false)
  }, [user, form, actions])

  const handleBlock = useCallback(() => { if (user) actions.blockUser(user.id) }, [user, actions])
  const handleUnblock = useCallback(() => { if (user) actions.unblockUser(user.id) }, [user, actions])
  const handleResetPassword = useCallback(() => { if (user) actions.resetPassword(user.id) }, [user, actions])

  if (isLoading) {
    return (
      <SlidePanelLayout title={<div className="h-[28px] lg:h-[32px] w-[160px] lg:w-[180px] animate-pulse rounded-[8px] lg:rounded-[10px] bg-surface-muted" />}>
        <div className="flex flex-col gap-3 lg:gap-[16px]">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-[36px] lg:h-[40px] animate-pulse rounded-[8px] lg:rounded-[10px] bg-surface-muted" />
          ))}
        </div>
      </SlidePanelLayout>
    )
  }

  if (!user) return null
  const isBlocked = user.status === "blocked"

  return (
    <SlidePanelLayout
      title={
        <div className="flex items-center gap-3 lg:gap-[14px]">
          <UserAvatar firstName={user.firstName} lastName={user.lastName} />
          <div className="flex flex-col">
            <h2 className="text-[20px] line-clamp-1 lg:text-[24px] font-bold tracking-[-0.6px] lg:tracking-[-0.72px] text-foreground">
              {user.firstName} {user.lastName}
            </h2>
            <span className="text-[13px] lg:text-[14px] font-medium tracking-[-0.39px] lg:tracking-[-0.42px] text-auchan-red">
              {USER_ROLE_LABELS[user.role]}
            </span>
          </div>
        </div>
      }
    >
      <div className="mb-2.5 lg:mb-[12px] flex items-center justify-between">
        <h3 className="text-[17px] lg:text-[20px] font-bold tracking-[-0.51px] lg:tracking-[-0.6px] text-foreground">
          Informations
        </h3>
        {!editing && (
          <CustomButton variant="ghost" size="sm" onClick={startEdit} disabled={isSelf} className="gap-1.5">
            <Pencil size={14} /> Modifier
          </CustomButton>
        )}
        {editing && (
          <CustomButton variant="ghost" size="sm" onClick={cancelEdit} className="gap-1.5">
            <X size={14} /> Annuler
          </CustomButton>
        )}
      </div>

      {editing ? (
        <EditForm form={form} setForm={setForm} onSave={saveEdit} disableRole={isSelf} />
      ) : (
        <ViewInfo user={user} isBlocked={isBlocked} />
      )}

      {isBlocked && user.blockReason && !editing && (
        <div className="mt-3 lg:mt-[16px] rounded-[10px] bg-auchan-red-light px-3.5 lg:px-[16px] py-2.5 lg:py-[12px]">
          <p className="text-[12px] lg:text-[13px] font-medium text-auchan-red">
            Raison : {user.blockReason}
          </p>
        </div>
      )}

      {isSelf && !editing && (
        <div className="mt-3 lg:mt-[16px] rounded-[10px] bg-amber-50 border border-amber-200 px-3.5 lg:px-[16px] py-2.5 lg:py-[12px]">
          <p className="text-[12px] lg:text-[13px] font-medium text-amber-700">
            Vous ne pouvez pas modifier votre propre compte depuis cette interface.
          </p>
        </div>
      )}

      {!editing && (
        <>
          <div className="my-5 lg:my-[24px] h-px bg-border-light" />
          <h3 className="mb-3 lg:mb-[16px] text-[17px] lg:text-[20px] font-bold tracking-[-0.51px] lg:tracking-[-0.6px] text-foreground">
            Actions
          </h3>
          <div className="flex flex-col gap-2 lg:gap-[10px]">
            {isBlocked ? (
              <CustomButton variant="outline" size="md" onClick={handleUnblock} disabled={isSelf} className="w-full justify-center gap-2">
                <Unlock size={16} /> Débloquer
              </CustomButton>
            ) : (
              <CustomButton variant="danger" size="md" onClick={handleBlock} disabled={isSelf} className="w-full justify-center gap-2">
                <Lock size={16} /> Bloquer
              </CustomButton>
            )}
            <CustomButton variant="secondary" size="md" onClick={handleResetPassword} disabled={isSelf} className="w-full justify-center gap-2">
              <RotateCcw size={16} /> Réinitialiser le mot de passe
            </CustomButton>
          </div>
        </>
      )}
    </SlidePanelLayout>
  )
}

type ViewInfoProps = { user: { email: string; store: string | null; createdAt: string; status: string }; isBlocked: boolean }

function ViewInfo({ user, isBlocked }: ViewInfoProps) {
  return (
    <div className="flex flex-col divide-y divide-border-light rounded-[12px] lg:rounded-[14px] bg-surface-muted px-3.5 lg:px-[16px]">
      <InfoRow label="Email" value={user.email} />
      <InfoRow label="Magasin" value={user.store ?? "Non assigné"} />
      <InfoRow label="Date de création" value={user.createdAt} />
      <div className="flex items-center justify-between py-2 lg:py-[10px]">
        <span className="text-[13px] lg:text-[14px] tracking-[-0.39px] lg:tracking-[-0.42px] text-text-secondary">Statut</span>
        <span className={cn(
          "rounded-full px-3 py-0.5 text-[12px] lg:text-[13px] font-bold",
          isBlocked ? "bg-auchan-red-light text-auchan-red" : "bg-auchan-green/10 text-auchan-green"
        )}>
          {isBlocked ? "Bloqué" : "Actif"}
        </span>
      </div>
    </div>
  )
}

type EditFormProps = {
  form: { firstName: string; lastName: string; email: string; role: UserRole }
  setForm: React.Dispatch<React.SetStateAction<EditFormProps["form"]>>
  onSave: () => void
  disableRole?: boolean
}

function EditForm({ form, setForm, onSave, disableRole }: EditFormProps) {
  return (
    <div className="flex flex-col gap-3">
      <InputText
        config={{ currentValue: form.firstName, onChange: (v) => setForm((p) => ({ ...p, firstName: v })) }}
        topLabel={{ text: "Prénom" }}
      />
      <InputText
        config={{ currentValue: form.lastName, onChange: (v) => setForm((p) => ({ ...p, lastName: v })) }}
        topLabel={{ text: "Nom" }}
      />
      <InputText
        config={{ currentValue: form.email, onChange: (v) => setForm((p) => ({ ...p, email: v })) }}
        topLabel={{ text: "Email" }}
      />
      <InputDropdown
        topLabel={{ text: "Rôle" }}
        options={ROLE_OPTIONS}
        value={form.role}
        onChange={(v) => setForm((p) => ({ ...p, role: v as UserRole }))}
        disabled={disableRole}
      />
      <CustomButton variant="primary" size="md" onClick={onSave} className="mt-2 w-full justify-center">
        Enregistrer
      </CustomButton>
    </div>
  )
}
