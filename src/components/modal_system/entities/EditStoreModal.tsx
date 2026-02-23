"use client"

import InputMultiSelect from "@/components/ui/forms/InputMultiSelect"
import InputSearchDropdown from "@/components/ui/forms/InputSearchDropdown"
import InputText from "@/components/ui/forms/InputText"
import { QUERY_KEYS } from "@/constants/querykeys.constant"
import { useInfiniteUserOptions } from "@/hooks/useInfiniteUserOptions"
import { storesService } from "@/services/stores/stores.service"
import { useEffect, useState } from "react"
import { ModalContent } from "../components/ModalContent"
import { useModal } from "../hooks/useModal"
import { useModalData } from "../hooks/useModalData"
import type { ModalConfig, ModalStep } from "../types/modal.types"

type EditStoreData = {
  name: string
  ville: string
  commune: string
  quartier: string
  managerId: string
  responsableCaissesId: string
  cashierIds: string[]
}

const INITIAL_DATA: EditStoreData = {
  name: "",
  ville: "",
  commune: "",
  quartier: "",
  managerId: "",
  responsableCaissesId: "",
  cashierIds: [],
}

function StepInfoEdit() {
  const { data, updateField } = useModalData<EditStoreData>(INITIAL_DATA)

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

function StepTeamEdit() {
  const { data, updateField } = useModalData<EditStoreData>(INITIAL_DATA)
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

export function EditStoreModal({ config: baseConfig }: { config: ModalConfig }) {
  const modal = useModal()
  const { getData, updateFields } = useModalData<EditStoreData>(INITIAL_DATA)
  const [loaded, setLoaded] = useState(false)
  const storeCode = baseConfig.entityId

  useEffect(() => {
    if (!storeCode || loaded) return
    storesService.getStoreById(storeCode).then((store) => {
      updateFields({
        name: store.name,
        ville: store.ville,
        commune: store.commune,
        quartier: store.quartier,
        managerId: store.managerId,
        responsableCaissesId: store.responsableCaissesId,
        cashierIds: store.cashierIds,
      })
      setLoaded(true)
    })
  }, [storeCode, loaded, updateFields])

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

  const handleComplete = async (): Promise<boolean> => {
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
    if (!storeCode) return false
    try {
      const { apiRequest } = await import("@/services/api/api.request.service")
      const { http } = await import("@/services/http")
      const { ENDPOINTS } = await import("@/constants/endpoints.constant")
      await apiRequest({
        request: () => http.patch(`${ENDPOINTS.STORES}/${storeCode}`, {
          name: data.name,
          ville: data.ville,
          commune: data.commune,
          quartier: data.quartier || undefined,
          managerId: data.managerId,
          responsableCaissesId: data.responsableCaissesId,
          cashierIds: data.cashierIds ?? [],
        }),
        config: {
          waitingMessage: "Mise à jour du magasin...",
          successMessage: "Magasin mis à jour avec succès",
          cacheKeys: [QUERY_KEYS.STORES, QUERY_KEYS.STORE_DETAIL],
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
      id: "info",
      label: "Informations",
      validate: validateStep1,
      component: <StepInfoEdit />,
    },
    {
      id: "team",
      label: "Équipe",
      validate: handleComplete,
      component: <StepTeamEdit />,
    },
  ]

  const config: ModalConfig = {
    ...baseConfig,
    steps,
    currentStep: modal.config?.currentStep ?? 0,
  }

  const currentStepValue = modal.config?.currentStep ?? 0

  useEffect(() => {
    modal.updateConfig({
      ...baseConfig,
      steps,
      title: currentStepValue === 0 ? "Modifier le magasin" : "Équipe du magasin",
      submitLabel: "Enregistrer",
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepValue])

  return <ModalContent config={config} />
}
