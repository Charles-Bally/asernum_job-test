"use client"

import InputDropdown from "@/components/ui/forms/InputDropdown"
import InputText from "@/components/ui/forms/InputText"
import { useUserActions } from "@/hooks/useGestionController"
import type { UserRole } from "@/types/user.types"
import { USER_ROLE_LABELS } from "@/types/user.types"
import { Check } from "lucide-react"
import { useEffect } from "react"
import { ModalContent } from "../components/ModalContent"
import { useModal } from "../hooks/useModal"
import { useModalData } from "../hooks/useModalData"
import type { ModalConfig, ModalStep } from "../types/modal.types"

type CreateUserData = {
  firstName: string
  lastName: string
  email: string
  role: string
  created: boolean
}

const INITIAL_DATA: CreateUserData = {
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  created: false,
}

const ROLE_OPTIONS = [
  { value: "ADMIN", label: USER_ROLE_LABELS.ADMIN, description: "Accès complet au système" },
  { value: "MANAGER", label: USER_ROLE_LABELS.MANAGER, description: "Gestion des magasins et équipes" },
  { value: "RESPONSABLE_CAISSES", label: USER_ROLE_LABELS.RESPONSABLE_CAISSES, description: "Supervision des caisses" },
  { value: "CAISSIER", label: USER_ROLE_LABELS.CAISSIER, description: "Opérations de caisse" },
]

function StepIdentity() {
  const { data, updateField } = useModalData<CreateUserData>(INITIAL_DATA)

  return (
    <div className="flex flex-col gap-4 lg:gap-[20px] px-1">
      <div className="flex gap-3 lg:gap-[16px]">
        <InputText
          topLabel={{ text: "Prénom", required: true }}
          config={{ placeholder: "Ex: Amadou", currentValue: data.firstName ?? "", onChange: (v) => updateField("firstName", v) }}
        />
        <InputText
          topLabel={{ text: "Nom", required: true }}
          config={{ placeholder: "Ex: Konaté", currentValue: data.lastName ?? "", onChange: (v) => updateField("lastName", v) }}
        />
      </div>
      <InputText
        topLabel={{ text: "Email", required: true }}
        config={{ placeholder: "Ex: amadou.konate@auchan.ci", type: "email", currentValue: data.email ?? "", onChange: (v) => updateField("email", v) }}
      />
      <InputDropdown
        topLabel={{ text: "Rôle", required: true }}
        options={ROLE_OPTIONS}
        value={data.role ?? ""}
        onChange={(v) => updateField("role", v)}
        placeholder="Sélectionner un rôle"
      />
    </div>
  )
}

function StepRecap() {
  const { data } = useModalData<CreateUserData>(INITIAL_DATA)
  const isAdmin = data.role === "ADMIN"

  if (data.created) {
    return (
      <div className="flex flex-col items-center gap-4 lg:gap-[20px] py-4">
        <div className="flex size-[56px] items-center justify-center rounded-full bg-auchan-green/10">
          <Check size={28} className="text-auchan-green" />
        </div>
        <p className="text-[17px] lg:text-[20px] font-bold tracking-[-0.51px] text-foreground">Compte créé</p>
        <p className="text-center text-[13px] lg:text-[14px] text-text-secondary leading-relaxed">
          {isAdmin ? (
            <>Le mot de passe temporaire a été envoyé par email à{" "}
              <span className="font-bold text-foreground">{data.email}</span>.</>
          ) : (
            <>Le mot de passe temporaire et le code d&apos;accès ont été envoyés par email à{" "}
              <span className="font-bold text-foreground">{data.email}</span>.</>
          )}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 lg:gap-[16px] px-1">
      <h3 className="text-[15px] lg:text-[17px] font-bold text-foreground">Récapitulatif</h3>
      <div className="flex flex-col divide-y divide-border-light rounded-[14px] bg-surface-muted px-4 lg:px-[20px]">
        <InfoLine label="Prénom" value={data.firstName ?? ""} />
        <InfoLine label="Nom" value={data.lastName ?? ""} />
        <InfoLine label="Email" value={data.email ?? ""} />
        <InfoLine label="Rôle" value={data.role ? USER_ROLE_LABELS[data.role as UserRole] : ""} />
      </div>
      {!isAdmin && data.role && (
        <p className="text-[12px] lg:text-[13px] text-text-secondary leading-relaxed px-1">
          Un code d&apos;accès caisse sera également généré et envoyé par email.
        </p>
      )}
    </div>
  )
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 lg:py-[12px]">
      <span className="text-[13px] lg:text-[14px] text-text-secondary">{label}</span>
      <span className="text-[14px] lg:text-[16px] font-bold text-foreground">{value}</span>
    </div>
  )
}

export function CreateUserModal({ config: baseConfig }: { config: ModalConfig; data?: any }) {
  const modal = useModal()
  const { getData } = useModalData<CreateUserData>(INITIAL_DATA)
  const actions = useUserActions()

  const validateStep1 = async (): Promise<boolean> => {
    const data = getData()
    if (!data.firstName?.trim() || !data.lastName?.trim() || !data.email?.trim() || !data.role) {
      const { dialog, DIALOG } = await import("@/components/dialog_system/services/dialog.service")
      await dialog({
        type: DIALOG.WARNING,
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
      })
      return false
    }
    return true
  }

  const handleComplete = async (): Promise<boolean> => {
    const data = getData()
    try {
      await actions.createUser({
        firstName: data.firstName!,
        lastName: data.lastName!,
        email: data.email!,
        role: data.role as UserRole,
      })
      modal.close()
      return true
    } catch {
      return false
    }
  }

  const steps: ModalStep[] = [
    {
      id: "identity",
      label: "Identité & Rôle",
      validate: validateStep1,
      component: <StepIdentity />,
    },
    {
      id: "recap",
      label: "Confirmation",
      validate: handleComplete,
      component: <StepRecap />,
    },
  ]

  const config: ModalConfig = {
    ...baseConfig,
    steps,
    currentStep: modal.config?.currentStep ?? 0,
  }

  useEffect(() => {
    const currentStep = modal.config?.currentStep ?? 0
    modal.updateConfig({
      ...baseConfig,
      steps,
      title: currentStep === 0 ? "Nouvel utilisateur" : "Confirmation",
      submitLabel: "Créer l'utilisateur",
    })
  }, [modal.config?.currentStep])

  return <ModalContent config={config} />
}
