"use client"

import { useDialog } from "@/components/dialog_system/hooks/useDialog"
import InputPassword from "@/components/ui/forms/InputPassword"
import { apiRequest } from "@/services/api/api.request.service"
import { http } from "@/services/http"
import { ENDPOINTS } from "@/constants/endpoints.constant"
import { useEffect } from "react"
import { ModalContent } from "../components/ModalContent"
import { useModal } from "../hooks/useModal"
import { useModalData } from "../hooks/useModalData"
import type { ModalConfig, ModalStep } from "../types/modal.types"

type ChangePasswordData = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  error: string
}

const INITIAL_DATA: ChangePasswordData = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  error: "",
}

function isPasswordStrong(password: string) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*\-_:;.,?/]/.test(password)
  )
}

function StepPassword() {
  const { data, updateField } = useModalData<ChangePasswordData>(INITIAL_DATA)

  return (
    <div className="flex flex-col gap-4 lg:gap-[20px] px-1">
      <InputPassword
        topLabel={{ text: "Mot de passe actuel", required: true }}
        config={{
          placeholder: "Entrez votre mot de passe actuel",
          currentValue: data.currentPassword ?? "",
          onChange: (v) => updateField("currentPassword", v),
        }}
      />

      <InputPassword
        topLabel={{ text: "Nouveau mot de passe", required: true }}
        config={{
          placeholder: "Entrez un nouveau mot de passe",
          currentValue: data.newPassword ?? "",
          onChange: (v) => updateField("newPassword", v),
          showStrengthIndicator: true,
          showValidationCriteria: true,
        }}
      />

      <InputPassword
        topLabel={{ text: "Confirmer le mot de passe", required: true }}
        config={{
          placeholder: "Confirmez le nouveau mot de passe",
          currentValue: data.confirmPassword ?? "",
          onChange: (v) => updateField("confirmPassword", v),
        }}
        error={
          (data.confirmPassword?.length ?? 0) > 0 && data.confirmPassword !== data.newPassword
            ? { active: true, message: "Les mots de passe ne correspondent pas" }
            : undefined
        }
      />

      {data.error && (
        <p className="text-[13px] text-auchan-red font-medium">{data.error}</p>
      )}
    </div>
  )
}

export function ChangePasswordModal({ config: baseConfig }: { config: ModalConfig; data?: any }) {
  const modal = useModal()
  const { dialog, DIALOG } = useDialog()
  const { getData } = useModalData<ChangePasswordData>(INITIAL_DATA)

  const validateAndSubmit = async (): Promise<boolean> => {
    const data = getData()

    if (!data.currentPassword?.trim()) {
      await dialog({
        type: DIALOG.WARNING,
        title: "Champ requis",
        description: "Veuillez entrer votre mot de passe actuel.",
      })
      return false
    }

    if (!isPasswordStrong(data.newPassword ?? "")) {
      await dialog({
        type: DIALOG.WARNING,
        title: "Mot de passe faible",
        description: "Le nouveau mot de passe ne respecte pas les critères de sécurité.",
      })
      return false
    }

    if (data.newPassword !== data.confirmPassword) {
      await dialog({
        type: DIALOG.WARNING,
        title: "Mots de passe différents",
        description: "Le nouveau mot de passe et la confirmation ne correspondent pas.",
      })
      return false
    }

    try {
      await apiRequest({
        request: () => http.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
        config: {
          waitingMessage: "Modification du mot de passe...",
          successTitle: "Mot de passe modifié",
          successMessage: "Votre mot de passe a été changé avec succès.",
          showApiErrorMessage: true,
        },
      })

      modal.close()
      return true
    } catch {
      return false
    }
  }

  const steps: ModalStep[] = [
    {
      id: "password",
      label: "Mot de passe",
      validate: validateAndSubmit,
      component: <StepPassword />,
    },
  ]

  const config: ModalConfig = {
    ...baseConfig,
    steps,
    currentStep: modal.config?.currentStep ?? 0,
  }

  useEffect(() => {
    modal.updateConfig({
      ...baseConfig,
      steps,
      title: "Changer le mot de passe",
      submitLabel: "Confirmer",
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <ModalContent config={config} />
}
