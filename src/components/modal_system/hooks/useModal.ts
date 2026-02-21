"use client";

import { useModalURL } from "@/components/modal_system/hooks/useModalURL";
import { useModalStore } from "@/components/modal_system/store/useModal.store";
import type { ModalConfig } from "@/components/modal_system/types/modal.types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useModalInstance } from "../context/ModalInstanceContext";

/**
 * Hook principal pour utiliser les modals dans les composants
 * Simplifie l'accès aux fonctionnalités des modals
 * Supporte le stacking (empilement) de modals
 *
 * 🆕 Cross-modal access: Permet de cibler n'importe quel modal par son ID
 *
 * @param targetModalId - ID du modal à cibler (optionnel). Si fourni, toutes les opérations
 *                        s'appliquent à ce modal au lieu du modal courant.
 *
 * @example
 * ```tsx
 * // Utilisation normale (modal courant)
 * const modal = useModal();
 * modal.view({ entity: "employee", entityId: "123" });
 *
 * // 🆕 Cibler un autre modal par son ID
 * const parentModal = useModal("parent-modal-id");
 * parentModal.updateData({ status: "updated" });
 * parentModal.setTab("details");
 * parentModal.close();
 * ```
 */
export function useModal(targetModalId?: string) {
  const instance = useModalInstance();
  const {
    isOpen,
    config: activeConfig,
    openModal,
    closeModal,
    setActiveTab,
    updateURL,
  } = useModalURL();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /**
   * Nettoie l'URL en retirant tous les paramètres du modal
   */
  const cleanModalURL = useCallback(() => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.delete("modal");
    params.delete("modalEntity");
    params.delete("modalId");
    params.delete("modalMode");
    params.delete("modalTab");
    params.delete("modalSize");

    // Supprimer les params additionnels
    Array.from(params.keys()).forEach((key) => {
      if (key.startsWith("mp_")) {
        params.delete(key);
      }
    });

    const queryString = params.toString();
    const currentPath = pathname ?? "/";
    const url = queryString ? `${currentPath}?${queryString}` : currentPath;
    router.push(url, { scroll: false });
  }, [pathname, searchParams, router]);

  // 🆕 Récupérer le modal cible depuis le store (réactif)
  const targetModal = useModalStore(
    useCallback(
      (state) => {
        if (!targetModalId) return null;
        return state.getModalById(targetModalId);
      },
      [targetModalId],
    ),
  );

  // Déterminer quel modal on cible
  const modalId = targetModalId ?? (instance?.id ?? activeConfig?.id);
  const currentConfig = targetModal ?? (instance?.config ?? activeConfig ?? null);
  const isInstanceOpen = targetModal ? true : (instance ? true : isOpen);
  const isActive = targetModal
    ? targetModal.id === useModalStore.getState().config?.id
    : instance
      ? instance.isActive
      : isOpen;

  const pushModal = useCallback((modalConfig: ModalConfig) => {
    useModalStore.getState().push(modalConfig);
  }, []);

  /**
   * Pop avec nettoyage URL - si plus de modal après pop, nettoie l'URL
   */
  const popModal = useCallback(() => {
    const store = useModalStore.getState();
    const stackBeforePop = store.stack.length;

    store.pop();

    // Si la stack était vide avant pop (donc on ferme le dernier), nettoyer l'URL
    if (stackBeforePop === 0) {
      cleanModalURL();
    } else {
      // Sinon mettre à jour l'URL avec le nouveau config actif
      const newConfig = useModalStore.getState().config;
      if (newConfig) {
        updateURL(newConfig);
      }
    }
  }, [cleanModalURL, updateURL]);

  /**
   * CloseAll avec nettoyage URL
   */
  const closeAllModals = useCallback(() => {
    useModalStore.getState().closeAll();
    cleanModalURL();
  }, [cleanModalURL]);

  const getStackCount = useCallback(
    () => useModalStore.getState().getStackCount(),
    [],
  );

  const setTab = useCallback(
    (tabId: string) => {
      const store = useModalStore.getState();
      const targetId = modalId ?? store.config?.id;
      if (!targetId) return;

      store.setActiveTab(tabId, targetId);

      const shouldSyncURL = !instance || targetId === activeConfig?.id;
      if (shouldSyncURL) {
        setActiveTab(tabId);
      }
    },
    [activeConfig?.id, instance, modalId, setActiveTab],
  );

  const updateConfig = useCallback(
    (newConfig: Partial<ModalConfig>) => {
      useModalStore.getState().updateConfig(newConfig, modalId);
    },
    [modalId],
  );

  const goToStep = useCallback(
    (stepIndex: number) => {
      useModalStore.getState().goToStep(stepIndex, modalId);
    },
    [modalId],
  );

  const nextStep = useCallback(() => {
    return useModalStore.getState().nextStep(modalId);
  }, [modalId]);

  const prevStep = useCallback(() => {
    useModalStore.getState().prevStep(modalId);
  }, [modalId]);

  const updateData = useCallback(
    (data: Record<string, any>) => {
      useModalStore.getState().updateData(data, modalId);
    },
    [modalId],
  );

  // 🆕 Fermer un modal spécifique (supporte cross-modal) avec nettoyage URL
  const closeTargetModal = useCallback(() => {
    if (targetModalId) {
      const store = useModalStore.getState();
      const position = store.getStackPosition(targetModalId);

      // Si c'est le modal actif, utiliser close() + clean URL
      if (position === store.getStackCount() - 1) {
        store.close();
        cleanModalURL();
      } else {
        // Sinon, retirer le modal de la stack
        const allModals = store.getAllModals();
        const filtered = allModals.filter((m) => m.id !== targetModalId);

        if (filtered.length > 0) {
          const newConfig = filtered[filtered.length - 1];
          const newStack = filtered.slice(0, -1);
          useModalStore.setState({ config: newConfig, stack: newStack });
          // Mettre à jour l'URL avec le nouveau config actif
          if (newConfig) {
            updateURL(newConfig);
          }
        } else {
          store.close();
          cleanModalURL();
        }
      }
    } else {
      closeModal();
    }
  }, [closeModal, targetModalId, cleanModalURL, updateURL]);

  // 🆕 Helpers de navigation cross-modal
  const getParent = useCallback(() => {
    if (!modalId) return null;
    return useModalStore.getState().getParentModal(modalId);
  }, [modalId]);

  const getAllParents = useCallback(() => {
    if (!modalId) return [];
    return useModalStore.getState().getAllParents(modalId);
  }, [modalId]);

  const getChildren = useCallback(() => {
    if (!modalId) return [];
    return useModalStore.getState().getChildren(modalId);
  }, [modalId]);

  const getStackPosition = useCallback(() => {
    if (!modalId) return null;
    return useModalStore.getState().getStackPosition(modalId);
  }, [modalId]);

  const setStepValidated = useCallback(
    (stepId: string, validated: boolean) => {
      useModalStore.getState().setStepValidated(stepId, validated, modalId);
    },
    [modalId],
  );

  const isStepAccessible = useCallback(
    (stepIndex: number) => {
      return useModalStore.getState().isStepAccessible(stepIndex, modalId);
    },
    [modalId],
  );

  const helpers = useMemo(
    () => ({
      view: (config: Partial<ModalConfig>) =>
        openModal({ ...config, mode: "view" } as ModalConfig),
      edit: (config: Partial<ModalConfig>) =>
        openModal({ ...config, mode: "edit" } as ModalConfig),
      create: (config: Partial<ModalConfig>) =>
        openModal({ ...config, mode: "create" } as ModalConfig),
      delete: (config: Partial<ModalConfig>) =>
        openModal({ ...config, mode: "delete" } as ModalConfig),
      details: (config: Partial<ModalConfig>) =>
        openModal({ ...config, mode: "details" } as ModalConfig),
    }),
    [openModal],
  );

  return {
    /** Le modal est-il ouvert ? */
    isOpen: isInstanceOpen,

    /** Le modal courant est-il en haut de pile ? */
    isActive,

    /** Configuration actuelle du modal */
    config: currentConfig,

    /** ID du modal ciblé */
    id: modalId,

    /** Niveau dans la pile de modals (0 = racine) */
    level: instance?.level ?? 0,

    /** Ouvrir le modal avec une configuration */
    open: (modalConfig: ModalConfig) => openModal(modalConfig),

    /** Fermer le modal (supporte cross-modal) */
    close: closeTargetModal,

    /** Changer l'onglet actif */
    setTab,

    /** Mettre à jour la configuration du modal */
    updateConfig,

    /** Empiler un nouveau modal par-dessus le courant */
    push: pushModal,

    /** Dépiler (fermer le modal du dessus et revenir au précédent) */
    pop: popModal,

    /** Fermer tous les modals d'un coup */
    closeAll: closeAllModals,

    /** Obtenir le nombre de modals dans la pile */
    getStackCount,

    /** Aller à une étape spécifique */
    goToStep,

    /** Aller à l'étape suivante */
    nextStep,

    /** Revenir à l'étape précédente */
    prevStep,

    /** Mettre à jour les données du modal */
    updateData,

    // 🆕 Helpers de navigation cross-modal
    /** Récupérer le modal parent */
    getParent,

    /** Récupérer tous les modals parents (hiérarchie complète) */
    getAllParents,

    /** Récupérer les modals enfants */
    getChildren,

    /** Récupérer la position dans la stack */
    getStackPosition,

    // Validation des steps
    /** Marquer une step comme validée ou non */
    setStepValidated,

    /** Vérifier si une step est accessible */
    isStepAccessible,

    /** Helpers rapides pour les cas d'usage courants */
    ...helpers,
  };
}
