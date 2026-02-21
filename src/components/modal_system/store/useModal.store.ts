import type { ModalConfig, ModalStore } from "@/components/modal_system/types/modal.types";
import { create } from "zustand";

/**
 * Génère un ID unique pour un modal
 */
let modalIdCounter = 0;
function generateModalId(): string {
  return `modal-${Date.now()}-${++modalIdCounter}`;
}

/**
 * Compare deux ModalConfig pour vérifier s'ils sont égaux
 * Ignore les fonctions et fait une comparaison intelligente des valeurs
 */
function isModalConfigEqual(a: ModalConfig, b: ModalConfig): boolean {
  // Comparaison rapide des références
  if (a === b) return true;

  // Propriétés clés à comparer (uniquement les valeurs primitives importantes)
  const keysToCompare: (keyof ModalConfig)[] = [
    "title",
    "subtitle",
    "size",
    "mode",
    "entity",
    "entityId",
    "activeTab",
    "currentStep",
    "submitLabel",
    "cancelLabel",
    "submitDisabled",
    "closeOnOverlayClick",
    "showCloseButton",
    "showHeader",
    "showFooter",
  ];

  for (const key of keysToCompare) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  // Comparaison spéciale pour les arrays/objets simples
  try {
    // Steps: comparer uniquement la longueur et les IDs (ignorer les fonctions/components)
    const hasStepsA = a.steps !== undefined && a.steps !== null;
    const hasStepsB = b.steps !== undefined && b.steps !== null;

    if (hasStepsA !== hasStepsB) return false;
    if (hasStepsA && hasStepsB) {
      if (a.steps!.length !== b.steps!.length) return false;
      for (let i = 0; i < a.steps!.length; i++) {
        const stepA = a.steps![i];
        const stepB = b.steps![i];
        if (!stepA || !stepB) return false;
        if (stepA.id !== stepB.id || stepA.label !== stepB.label) {
          return false;
        }
      }
    }

    // Data: comparaison shallow (ignorer si undefined)
    const hasDataA = a.data !== undefined && a.data !== null;
    const hasDataB = b.data !== undefined && b.data !== null;
    if (hasDataA !== hasDataB) return false;
    if (hasDataA && hasDataB) {
      if (JSON.stringify(a.data) !== JSON.stringify(b.data)) return false;
    }

    // Tabs: comparaison du nombre et des IDs
    const hasTabsA = a.tabs !== undefined && a.tabs !== null;
    const hasTabsB = b.tabs !== undefined && b.tabs !== null;
    if (hasTabsA !== hasTabsB) return false;
    if (hasTabsA && hasTabsB) {
      if (a.tabs!.length !== b.tabs!.length) return false;
      for (let i = 0; i < a.tabs!.length; i++) {
        if (a.tabs![i]?.id !== b.tabs![i]?.id) return false;
      }
    }
  } catch {
    // En cas d'erreur de stringification, considérer comme différent
    return false;
  }

  return true;
}

/**
 * Store Zustand pour gérer l'état global des modals
 * Supporte le stacking (empilement) de plusieurs modals
 * Synchronisé avec l'URL via le hook useModalURL
 */
export const useModalStore = create<ModalStore>((set, get) => {
  const resolveModalId = (modalId?: string): string | undefined => {
    if (modalId) {
      return modalId;
    }
    return get().config?.id;
  };

  const updateModalEntry = (
    modalId: string | undefined,
    updater: (modal: ModalConfig) => ModalConfig,
  ) => {
    const targetId = resolveModalId(modalId);
    if (!targetId) {
      return;
    }

    set((state) => {
      if (state.config?.id === targetId && state.config) {
        const updatedConfig = updater(state.config);
        // Ne mettre à jour que si les valeurs ont réellement changé
        if (isModalConfigEqual(state.config, updatedConfig)) {
          return state; // Retourner l'état actuel sans changement
        }
        return { config: updatedConfig };
      }

      const index = state.stack.findIndex((modal) => modal.id === targetId);
      if (index === -1) {
        return state; // Pas trouvé, retourner l'état actuel
      }

      const modal = state.stack[index];
      const updatedModal = updater(modal);

      // Ne mettre à jour que si les valeurs ont réellement changé
      if (isModalConfigEqual(modal, updatedModal)) {
        return state; // Retourner l'état actuel sans changement
      }

      const updatedStack = state.stack.map((m, idx) =>
        idx === index ? updatedModal : m,
      );

      return { stack: updatedStack };
    });
  };

  const readModalEntry = (modalId?: string): ModalConfig | null => {
    const targetId = resolveModalId(modalId);
    if (!targetId) {
      return null;
    }

    const state = get();

    if (state.config?.id === targetId) {
      return state.config;
    }

    return state.stack.find((modal) => modal.id === targetId) ?? null;
  };

  return {
    config: null,
    isOpen: false,
    stack: [],

    open: (config: ModalConfig) => {
      const configWithId = { ...config, id: config.id || generateModalId() };
      set({ config: configWithId, isOpen: true });
    },

    close: () => {
      set({ isOpen: false });
      setTimeout(() => {
        const currentState = get();
        if (!currentState.isOpen) {
          set({ config: null });
        }
      }, 300);
    },

    updateConfig: (newConfig: Partial<ModalConfig>, modalId?: string) => {
      updateModalEntry(modalId, (modal) => ({ ...modal, ...newConfig }));
    },

    setActiveTab: (tabId: string, modalId?: string) => {
      updateModalEntry(modalId, (modal) => ({ ...modal, activeTab: tabId }));
    },

    push: (config: ModalConfig) => {
      const currentConfig = get().config;
      const configWithId = { ...config, id: config.id || generateModalId() };

      if (currentConfig) {
        // 🆕 Gérer la relation parent-enfant automatiquement
        const parentId = currentConfig.id;
        const childId = configWithId.id;

        // Ajouter parentId au modal enfant
        const configWithParent = { ...configWithId, parentId };

        // Mettre à jour le parent pour ajouter l'enfant
        const updatedParent = {
          ...currentConfig,
          children: [...(currentConfig.children || []), childId],
        };

        set((state) => ({
          stack: [...state.stack, updatedParent],
          config: configWithParent,
          isOpen: true,
        }));
      } else {
        set({ config: configWithId, isOpen: true });
      }
    },

    pop: () => {
      const stack = get().stack;
      if (stack.length > 0) {
        const previous = stack[stack.length - 1];
        set({
          config: previous,
          stack: stack.slice(0, -1),
          isOpen: true,
        });
      } else {
        get().close();
      }
    },

    closeAll: () => {
      set({ isOpen: false, stack: [] });
      setTimeout(() => {
        const currentState = get();
        if (!currentState.isOpen) {
          set({ config: null });
        }
      }, 300);
    },

    getStackCount: () => {
      const state = get();
      return state.isOpen ? state.stack.length + 1 : 0;
    },

    goToStep: (stepIndex: number, modalId?: string) => {
      updateModalEntry(modalId, (modal) => {
        if (!modal.steps || modal.steps.length === 0) {
          return modal;
        }

        const boundedIndex = Math.max(
          0,
          Math.min(stepIndex, modal.steps.length - 1),
        );

        if (modal.currentStep === boundedIndex) {
          return modal;
        }

        return { ...modal, currentStep: boundedIndex };
      });
    },

    nextStep: async (modalId?: string) => {
      const targetModal = readModalEntry(modalId);
      if (!targetModal?.steps || targetModal?.steps?.length === 0) {
        return;
      }

      const currentStep = targetModal.currentStep ?? 0;
      const step = targetModal.steps[currentStep];

      if (step?.validate) {
        const isValid = await step.validate();
        if (!isValid) return;
      }

      if (targetModal.onBeforeNext) {
        const canProceed = await targetModal.onBeforeNext(currentStep);
        if (!canProceed) return;
      }

      if (step?.onNext) {
        await step.onNext();
      }

      if (currentStep < targetModal.steps.length - 1) {
        updateModalEntry(targetModal.id ?? modalId, (modal) => ({
          ...modal,
          currentStep: currentStep + 1,
        }));
      } else if (targetModal.onComplete) {
        await targetModal.onComplete(targetModal.data);
      }
    },

    prevStep: async (modalId?: string) => {
      const targetModal = readModalEntry(modalId);
      if (!targetModal?.steps || targetModal.steps.length === 0) {
        return;
      }

      const currentStep = targetModal.currentStep ?? 0;
      if (currentStep <= 0) {
        return;
      }

      const step = targetModal.steps[currentStep];

      // Appeler onBeforeBack si défini (permet confirm dialog)
      if (targetModal.onBeforeBack) {
        const canGoBack = await targetModal.onBeforeBack(currentStep);
        if (!canGoBack) return;
      }

      // Appeler step.onBack si défini
      if (step?.onBack) {
        await step.onBack();
      }

      updateModalEntry(targetModal.id ?? modalId, (modal) => ({
        ...modal,
        currentStep: currentStep - 1,
      }));
    },

    updateData: (data: Record<string, any>, modalId?: string) => {
      updateModalEntry(modalId, (modal) => ({
        ...modal,
        data: { ...modal.data, ...data },
      }));
    },

    getModalById: (modalId: string) => {
      // 1. Essayer par ID généré (uuid)
      const modal = readModalEntry(modalId);
      if (modal) return modal;

      const allModals = [get().config, ...get().stack].filter(
        (m): m is ModalConfig => m !== null,
      );

      // 2. Fallback: Chercher par customId
      const byCustomId = allModals.find((m) => m.customId === modalId);
      if (byCustomId) return byCustomId;

      // 3. Fallback: Chercher par entity
      const byEntity = allModals.find((m) => m.entity === modalId);
      return byEntity || null;
    },

    // 🆕 Helpers de navigation cross-modal
    getAllModals: () => {
      const { config, stack } = get();
      return config ? [...stack, config] : stack;
    },

    getParentModal: (modalId: string) => {
      const modal = get().getModalById(modalId);
      if (!modal?.parentId) return null;
      return get().getModalById(modal.parentId);
    },

    getAllParents: (modalId: string) => {
      const parents: ModalConfig[] = [];
      let current = get().getModalById(modalId);

      while (current?.parentId) {
        const parent = get().getModalById(current.parentId);
        if (!parent) break;
        parents.push(parent);
        current = parent;
      }

      return parents;
    },

    getChildren: (modalId: string) => {
      const modal = get().getModalById(modalId);
      if (!modal?.children || modal.children.length === 0) return [];

      return modal.children
        .map((childId) => get().getModalById(childId))
        .filter((child): child is ModalConfig => child !== null);
    },

    getStackPosition: (modalId: string) => {
      const { config, stack } = get();

      // Top of stack (modal actif)
      if (config?.id === modalId) return stack.length;

      // Dans la stack
      const index = stack.findIndex((m) => m.id === modalId);
      return index === -1 ? null : index;
    },

    // Validation des steps
    setStepValidated: (stepId: string, validated: boolean, modalId?: string) => {
      updateModalEntry(modalId, (modal) => ({
        ...modal,
        stepsValidation: {
          ...modal.stepsValidation,
          [stepId]: validated,
        },
      }));
    },

    isStepAccessible: (stepIndex: number, modalId?: string) => {
      const modal = readModalEntry(modalId);
      if (!modal?.steps) return false;

      // Step 0 toujours accessible
      if (stepIndex === 0) return true;

      // Steps déjà visitées (< currentStep) toujours accessibles
      const currentStep = modal.currentStep ?? 0;
      if (stepIndex <= currentStep) return true;

      // Vérifier que toutes les steps précédentes sont validées
      for (let i = 0; i < stepIndex; i++) {
        const stepId = modal.steps[i]?.id;
        if (stepId && !modal.stepsValidation?.[stepId]) {
          return false;
        }
      }
      return true;
    },
  };
});
