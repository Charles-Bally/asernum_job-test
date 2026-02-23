"use client"

import CustomButton from "@/components/ui/render/CustomButton"
import InputText from "@/components/ui/forms/InputText"
import { useModal } from "@/components/modal_system/hooks/useModal"
import { toast, TOAST } from "@/components/toast_system"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { cn } from "@/lib/utils"
import { profileService } from "@/services/auth/profile.service"
import type { AuthUser } from "@/store/auth.store"
import { USER_ROLE_LABELS } from "@/types/user.types"
import type { UserRole } from "@/types/user.types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { motion, type Variants } from "framer-motion"
import { ChevronRight, KeyRound, Pencil } from "lucide-react"
import { useState } from "react"

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

function useProfile() {
  return useQuery<AuthUser>({
    queryKey: [...QUERY_KEYS.AUTH.PROFILE],
    queryFn: () => profileService.getProfile(),
  })
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-4 lg:gap-[20px] max-w-[700px]">
      {/* Header card */}
      <div className="flex items-center gap-4 lg:gap-5 rounded-[20px] lg:rounded-[40px] bg-white px-5 lg:px-[35px] py-5 lg:py-[30px]">
        <div className="size-[56px] lg:size-[72px] shrink-0 animate-pulse rounded-full bg-surface-muted" />
        <div className="flex flex-col gap-2.5">
          <div className="h-[22px] lg:h-[28px] w-[160px] lg:w-[220px] animate-pulse rounded-[8px] bg-surface-muted" />
          <div className="h-[22px] lg:h-[24px] w-[90px] lg:w-[110px] animate-pulse rounded-full bg-surface-muted" />
        </div>
      </div>

      {/* Informations card */}
      <div className="rounded-[20px] lg:rounded-[40px] bg-white px-5 lg:px-[35px] py-5 lg:py-[30px]">
        <div className="h-[18px] lg:h-[22px] w-[120px] lg:w-[140px] animate-pulse rounded-[6px] bg-surface-muted" />
        <div className="mt-4 flex flex-col divide-y divide-border-light">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 lg:py-[14px]">
              <div className="h-[13px] lg:h-[14px] w-[70px] lg:w-[90px] animate-pulse rounded-[5px] bg-surface-muted" />
              <div
                className="h-[14px] lg:h-[16px] animate-pulse rounded-[6px] bg-surface-muted"
                style={{ width: [180, 120, 140, 50][i] }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sécurité card */}
      <div className="rounded-[20px] lg:rounded-[40px] bg-white px-5 lg:px-[35px] py-5 lg:py-[30px]">
        <div className="h-[18px] lg:h-[22px] w-[80px] lg:w-[100px] animate-pulse rounded-[6px] bg-surface-muted" />
        <div className="mt-4">
          <div className="h-[42px] lg:h-[44px] w-[220px] lg:w-[260px] animate-pulse rounded-[12px] bg-surface-muted" />
        </div>
      </div>
    </div>
  )
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 lg:py-[14px]">
      <span className="text-[13px] lg:text-[14px] text-text-secondary">{label}</span>
      <span className="text-[14px] lg:text-[16px] font-bold text-foreground">{value}</span>
    </div>
  )
}

export function ProfilContent() {
  const { data: user, isLoading } = useProfile()
  const queryClient = useQueryClient()
  const modal = useModal()
  const [isEditing, setIsEditing] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [saving, setSaving] = useState(false)

  const startEdit = () => {
    if (!user) return
    setFirstName(user.firstName)
    setLastName(user.lastName)
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setIsEditing(false)
  }

  const saveEdit = async () => {
    if (!firstName.trim() || !lastName.trim()) return
    setSaving(true)
    try {
      await profileService.updateProfile({ firstName: firstName.trim(), lastName: lastName.trim() })
      await queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.AUTH.PROFILE] })
      setIsEditing(false)
      toast({ type: TOAST.SUCCESS, message: "Nom modifié avec succès" })
    } finally {
      setSaving(false)
    }
  }

  const openChangePassword = () => {
    modal.open({
      entity: "change-password",
      title: "Changer le mot de passe",
      size: "sm",
    })
  }

  if (isLoading) return <ProfileSkeleton />
  if (!user) return null

  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  const roleLabel = USER_ROLE_LABELS[user.role as UserRole] ?? user.role
  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—"

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 lg:gap-[20px] max-w-[700px]"
    >
      {/* Header : Avatar + Nom + Rôle */}
      <motion.div
        variants={fadeUp}
        className="rounded-[20px] lg:rounded-[40px] bg-white px-5 lg:px-[35px] py-5 lg:py-[30px]"
      >
        {isEditing ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 lg:gap-5">
              <div className="flex size-[56px] lg:size-[72px] shrink-0 items-center justify-center rounded-full bg-auchan-red">
                <span className="text-[20px] lg:text-[26px] font-black text-white">{initials}</span>
              </div>
              <div>
                <p className="text-[15px] lg:text-[17px] font-bold text-foreground">Modifier le nom</p>
                <p className="text-[12px] lg:text-[13px] text-text-secondary">Modifiez votre prénom et nom de famille</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <InputText
                topLabel={{ text: "Prénom", required: true }}
                config={{ placeholder: "Prénom", currentValue: firstName, onChange: setFirstName }}
              />
              <InputText
                topLabel={{ text: "Nom", required: true }}
                config={{ placeholder: "Nom", currentValue: lastName, onChange: setLastName }}
              />
            </div>
            <div className="flex items-center gap-3">
              <CustomButton variant="primary" size="sm" onClick={saveEdit} disabled={saving} className="px-5">
                {saving ? "Enregistrement..." : "Sauvegarder"}
              </CustomButton>
              <CustomButton variant="ghost" size="sm" onClick={cancelEdit} disabled={saving}>
                Annuler
              </CustomButton>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 lg:gap-5">
            <div className="flex size-[56px] lg:size-[72px] shrink-0 items-center justify-center rounded-full bg-auchan-red">
              <span className="text-[20px] lg:text-[26px] font-black text-white">{initials}</span>
            </div>
            <div className="flex flex-1 flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-[20px] lg:text-[26px] font-black tracking-[-0.6px] lg:tracking-[-0.78px] text-foreground truncate">
                  {user.firstName} {user.lastName}
                </h1>
                <button
                  type="button"
                  onClick={startEdit}
                  className="shrink-0 cursor-pointer rounded-full p-1.5 text-text-secondary transition-colors hover:bg-surface-muted hover:text-foreground"
                >
                  <Pencil size={16} />
                </button>
              </div>
              <span
                className={cn(
                  "mt-1 w-fit rounded-full px-3 py-0.5 text-[12px] lg:text-[13px] font-bold",
                  "bg-auchan-red/10 text-auchan-red"
                )}
              >
                {roleLabel}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Informations */}
      <motion.div
        variants={fadeUp}
        className="rounded-[20px] lg:rounded-[40px] bg-white px-5 lg:px-[35px] py-5 lg:py-[30px]"
      >
        <h2 className="text-[16px] lg:text-[20px] font-bold tracking-[-0.48px] lg:tracking-[-0.6px] text-text-caption">
          Informations
        </h2>
        <div className="mt-3 flex flex-col divide-y divide-border-light">
          <InfoLine label="Email" value={user.email} />
          {user.store && <InfoLine label="Magasin" value={user.store} />}
          <InfoLine label="Date de création" value={formattedDate} />
          <InfoLine
            label="Statut"
            value={user.isBlocked ? "Bloqué" : "Actif"}
          />
        </div>
      </motion.div>

      {/* Sécurité */}
      <motion.div
        variants={fadeUp}
        className="rounded-[20px] lg:rounded-[40px] bg-white px-5 lg:px-[35px] py-5 lg:py-[30px]"
      >
        <h2 className="text-[16px] lg:text-[20px] font-bold tracking-[-0.48px] lg:tracking-[-0.6px] text-text-caption">
          Sécurité
        </h2>
        <CustomButton
          variant="none"
          size="none"
          onClick={openChangePassword}
          className="mt-4 flex w-full items-center gap-4 rounded-[14px] border border-border-light px-4 lg:px-5 py-3.5 lg:py-4 transition-colors hover:bg-surface-muted"
        >
          <div className="flex size-[40px] lg:size-[44px] shrink-0 items-center justify-center rounded-full bg-auchan-red/10">
            <KeyRound size={20} className="text-auchan-red" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[14px] lg:text-[15px] font-bold text-foreground">
              Changer le mot de passe
            </span>
            <span className="text-[12px] lg:text-[13px] text-text-secondary">
              Modifiez votre mot de passe de connexion
            </span>
          </div>
          <ChevronRight size={18} className="ml-auto shrink-0 text-text-secondary" />
        </CustomButton>
      </motion.div>
    </motion.div>
  )
}
