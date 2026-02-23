"use client"

import InputCheckbox from "@/components/ui/forms/InputCheckbox"
import InputMultiSelect from "@/components/ui/forms/InputMultiSelect"
import InputSearchDropdown from "@/components/ui/forms/InputSearchDropdown"
import InputText from "@/components/ui/forms/InputText"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { useInfiniteUserOptions } from "@/hooks/useInfiniteUserOptions"
import { useEffect } from "react"
import { ModalContent } from "../components/ModalContent"
import { useModal } from "../hooks/useModal"
import { useModalData } from "../hooks/useModalData"
import type { ModalConfig, ModalStep } from "../types/modal.types"

type CreateStoreData = {
  name: string
  ville: string
  commune: string
  quartier: string
  managerId: string
  responsableCaissesId: string
  cashierIds: string[]
  generateClients: boolean
  generateTransactions: boolean
}

const INITIAL_DATA: CreateStoreData = {
  name: "",
  ville: "",
  commune: "",
  quartier: "",
  managerId: "",
  responsableCaissesId: "",
  cashierIds: [],
  generateClients: true,
  generateTransactions: true,
}

function StepInfo() {
  const { data, updateField } = useModalData<CreateStoreData>(INITIAL_DATA)

  return (
    <div className="flex flex-col gap-4 lg:gap-[20px] px-1">
      <InputText
        topLabel={{ text: "Nom du magasin", required: true }}
        config={{ placeholder: "Ex: Angré Djibi 1", currentValue: data.name ?? "", onChange: (v) => updateField("name", v) }}
      />
      <div className="flex gap-3 lg:gap-[16px]">
        <InputText
          topLabel={{ text: "Ville", required: true }}
          config={{ placeholder: "Ex: Abidjan", currentValue: data.ville ?? "", onChange: (v) => updateField("ville", v) }}
        />
        <InputText
          topLabel={{ text: "Commune", required: true }}
          config={{ placeholder: "Ex: Cocody", currentValue: data.commune ?? "", onChange: (v) => updateField("commune", v) }}
        />
      </div>
      <InputText
        topLabel={{ text: "Quartier" }}
        config={{ placeholder: "Ex: Angré", currentValue: data.quartier ?? "", onChange: (v) => updateField("quartier", v) }}
      />
    </div>
  )
}

function StepTeam() {
  const { data, updateField } = useModalData<CreateStoreData>(INITIAL_DATA)
  const managers = useInfiniteUserOptions("MANAGER")
  const rc = useInfiniteUserOptions("RESPONSABLE_CAISSES")
  const cashiers = useInfiniteUserOptions("CAISSIER")

  return (
    <div className="flex flex-col gap-4 lg:gap-[20px] px-1">
      <InputSearchDropdown
        topLabel={{ text: "Manager", required: true }}
        options={managers.options}
        value={data.managerId ?? ""}
        onChange={(v) => updateField("managerId", v)}
        placeholder="Sélectionner un manager"
        onSearch={managers.onSearch}
        onLoadMore={managers.onLoadMore}
        isLoading={managers.isLoading}
        hasMore={managers.hasMore}
      />
      <InputSearchDropdown
        topLabel={{ text: "Responsable Caisses", required: true }}
        options={rc.options}
        value={data.responsableCaissesId ?? ""}
        onChange={(v) => updateField("responsableCaissesId", v)}
        placeholder="Sélectionner un responsable"
        onSearch={rc.onSearch}
        onLoadMore={rc.onLoadMore}
        isLoading={rc.isLoading}
        hasMore={rc.hasMore}
      />
      <InputMultiSelect
        topLabel={{ text: "Caissiers" }}
        options={cashiers.options}
        value={data.cashierIds ?? []}
        onChange={(v) => updateField("cashierIds", v)}
        placeholder="Sélectionner les caissiers"
        onSearch={cashiers.onSearch}
        onLoadMore={cashiers.onLoadMore}
        isLoading={cashiers.isLoading}
        hasMore={cashiers.hasMore}
      />
    </div>
  )
}

function StepSeed() {
  const { data, updateField } = useModalData<CreateStoreData>(INITIAL_DATA)

  return (
    <div className="flex flex-col gap-4 lg:gap-[20px] px-1">
      <InputCheckbox
        label="Générer des clients"
        description="Crée ~15 clients fictifs rattachés au magasin"
        checked={data.generateClients ?? false}
        onChange={(v) => updateField("generateClients", v)}
      />
      <InputCheckbox
        label="Générer des transactions"
        description="Crée ~50 transactions réalistes avec les caissiers"
        checked={data.generateTransactions ?? false}
        onChange={(v) => updateField("generateTransactions", v)}
      />
    </div>
  )
}

export function CreateStoreModal({ config: baseConfig }: { config: ModalConfig }) {
  const modal = useModal()
  const { getData } = useModalData<CreateStoreData>(INITIAL_DATA)

  const validateStep1 = async (): Promise<boolean> => {
    const data = getData()
    if (!data.name?.trim() || !data.ville?.trim() || !data.commune?.trim()) {
      const { dialog, DIALOG } = await import("@/components/dialog_system/services/dialog.service")
      await dialog({
        type: DIALOG.WARNING,
        title: "Champs requis",
        description: "Veuillez remplir le nom, la ville et la commune.",
      })
      return false
    }
    return true
  }

  const validateStep2 = async (): Promise<boolean> => {
    const data = getData()
    if (!data.managerId || !data.responsableCaissesId) {
      const { dialog, DIALOG } = await import("@/components/dialog_system/services/dialog.service")
      await dialog({
        type: DIALOG.WARNING,
        title: "Champs requis",
        description: "Veuillez sélectionner un manager et un responsable caisses.",
      })
      return false
    }
    return true
  }

  const handleComplete = async (): Promise<boolean> => {
    const data = getData()
    try {
      const { apiRequest } = await import("@/services/api/api.request.service")
      const { http } = await import("@/services/http")
      const { ENDPOINTS } = await import("@/constants/endpoints.constant")

      const hasSeed = data.generateClients || data.generateTransactions
      const res = await apiRequest({
        request: () => http.post(ENDPOINTS.STORES, {
          name: data.name,
          ville: data.ville,
          commune: data.commune,
          quartier: data.quartier || undefined,
          managerId: data.managerId,
          responsableCaissesId: data.responsableCaissesId,
          cashierIds: data.cashierIds ?? [],
        }),
        config: {
          waitingMessage: "Création du magasin...",
          successMessage: hasSeed ? "Magasin créé" : "Magasin créé avec succès",
          autoCloseSuccessDialog: hasSeed,
          cacheKeys: [QUERY_KEYS.STORES],
        },
      })

      const storeCode = res?.data?.store?.code
      if (storeCode && (data.generateClients || data.generateTransactions)) {
        await apiRequest({
          request: () => http.post(`${ENDPOINTS.STORES}/${storeCode}/seed`, {
            generateClients: data.generateClients,
            generateTransactions: data.generateTransactions,
          }),
          config: {
            waitingMessage: "Génération des données de test...",
            successMessage: "Magasin créé avec données de test",
            cacheKeys: [QUERY_KEYS.STORES, QUERY_KEYS.CLIENTS, QUERY_KEYS.TRANSACTIONS],
          },
        })
      }

      modal.close()
      return true
    } catch {
      return false
    }
  }

  const steps: ModalStep[] = [
    {
      id: "info",
      label: "Informations",
      validate: validateStep1,
      component: <StepInfo />,
    },
    {
      id: "team",
      label: "Équipe",
      validate: validateStep2,
      component: <StepTeam />,
    },
    {
      id: "seed",
      label: "Données de test",
      validate: handleComplete,
      component: <StepSeed />,
    },
  ]

  const config: ModalConfig = {
    ...baseConfig,
    steps,
    currentStep: modal.config?.currentStep ?? 0,
  }

  const currentStepValue = modal.config?.currentStep ?? 0

  const STEP_TITLES = ["Nouveau magasin", "Équipe du magasin", "Données de test"]
  const currentTitle = STEP_TITLES[currentStepValue] ?? STEP_TITLES[0]

  useEffect(() => {
    modal.updateConfig({
      title: currentTitle,
      submitLabel: "Créer le magasin",
      steps,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTitle])

  return <ModalContent config={config} />
}
