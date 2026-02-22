import { useModalStore } from "@/components/modal_system/store/useModal.store";
import type { ModalConfig } from "@/components/modal_system/types/modal.types";
import { createElement } from "react";

/**
 * Met à jour l'URL avec les paramètres du modal (utilisable hors composant React)
 */
function updateURLWithModal(config: ModalConfig | null) {
  const url = new URL(window.location.href);

  if (!config) {
    url.searchParams.delete("modal");
    url.searchParams.delete("modalEntity");
    url.searchParams.delete("modalId");
    url.searchParams.delete("modalMode");
    url.searchParams.delete("modalTab");
    url.searchParams.delete("modalSize");
  } else {
    url.searchParams.set("modal", "true");
    if (config.entity) url.searchParams.set("modalEntity", config.entity);
    if (config.entityId) url.searchParams.set("modalId", config.entityId);
    if (config.mode) url.searchParams.set("modalMode", config.mode);
    if (config.activeTab) url.searchParams.set("modalTab", config.activeTab);
    if (config.size) url.searchParams.set("modalSize", config.size);
  }

  window.history.pushState({}, "", url.toString());
}

/**
 * Service pour gérer les modals de manière programmatique
 */
class ModalService {
  /**
   * Ouvre un modal simple (sans synchronisation URL)
   */
  open(config: ModalConfig) {
    return useModalStore.getState().open(config);
  }

  /**
   * Ouvre un modal avec synchronisation URL
   * À utiliser depuis les fichiers service.ts ou hors composants React
   */
  openWithURL(config: ModalConfig) {
    const newConfig = { ...config };
    if (!config.entityId && config.entity) {
      newConfig.entityId = config.entity;
    }
    useModalStore.getState().open(newConfig);
    updateURLWithModal(newConfig);
  }

  /**
   * Ferme un modal spécifique
   */
  close(_id: string): void {
    useModalStore.getState().close();
  }

  /**
   * Ferme tous les modals
   */
  closeAll(): void {
    useModalStore.getState().closeAll();
  }

  /**
   * Met à jour un modal
   */
  // update(id: string, config: Partial<ModalConfig>): void {
  //   useModalStore.getState().update(id, config);
  // }

  /**
   * Ouvre un modal de confirmation
   */
  confirm(options: {
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
  }) {
    return this.open({
      title: options.title || "Confirmation",
      content: createElement(
        "p",
        { className: "text-neutral-700" },
        options.message,
      ),
      size: "sm",
      buttons: [
        {
          label: options.cancelLabel || "Annuler",
          variant: "secondary",
          action: "cancel",
        },
        {
          label: options.confirmLabel || "Confirmer",
          variant: "primary",
          action: "submit",
          onClick: options.onConfirm,
        },
      ],
      onCancel: options.onCancel,
    });
  }

  /**
   * Ouvre un modal avec stepper
   */
  openStepper(config: Omit<ModalConfig, "showStepper">) {
    return this.open({
      ...config,
      showStepper: true,
    });
  }

  /**
   * Va à un step spécifique
   */
  goToStep(_id: string, stepIndex: number): void {
    useModalStore.getState().goToStep(stepIndex);
  }

  /**
   * Passe au step suivant
   */
  async nextStep(_id: string): Promise<void> {
    await useModalStore.getState().nextStep();
  }

  /**
   * Retourne au step précédent
   */
  prevStep(_id: string): void {
    useModalStore.getState().prevStep();
  }

  /**
   * Met à jour les données du modal
   */
  // updateData(id: string, data: Record<string, any>): void {
  //   useModalStore.getState().updateData(id, data);
  // }

  /**
   * Récupère un modal par son id
   */
  // getModal(id: string): ModalConfig | undefined {
  //   return useModalStore.getState().getModal(id);
  // }

  /**
   * Récupère le modal actif
   */
  // getActiveModal(): ModalConfig | undefined {
  //   return useModalStore.getState().getActiveModal();
  // }
}

export const modalService = new ModalService();
