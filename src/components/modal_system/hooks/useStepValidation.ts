"use client";

import { useCallback, useMemo } from "react";
import { useModal } from "./useModal";

/**
 * Hook pour gérer la validation des steps dans un modal wizard
 *
 * @param stepId - ID de la step à gérer (optionnel, utilise la step courante par défaut)
 *
 * @example
 * ```tsx
 * function Step1() {
 *   const { data } = useModalData<FormData>();
 *   const { setValidated } = useStepValidation();
 *
 *   useEffect(() => {
 *     const isComplete = data.firstName && data.lastName;
 *     setValidated(!!isComplete);
 *   }, [data.firstName, data.lastName]);
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useStepValidation(stepId?: string) {
  const modal = useModal();

  // Déterminer l'ID de la step courante
  const currentStepIndex = modal.config?.currentStep ?? 0;
  const currentStepId = useMemo(() => {
    return stepId ?? modal.config?.steps?.[currentStepIndex]?.id;
  }, [stepId, modal.config?.steps, currentStepIndex]);

  // Vérifier si la step est validée
  const isValidated = useMemo(() => {
    if (!currentStepId) return false;
    return modal.config?.stepsValidation?.[currentStepId] ?? false;
  }, [currentStepId, modal.config?.stepsValidation]);

  // Marquer la step comme validée/non validée
  const setValidated = useCallback(
    (validated: boolean) => {
      if (currentStepId) {
        modal.setStepValidated(currentStepId, validated);
      }
    },
    [currentStepId, modal.setStepValidated],
  );

  // Vérifier si toutes les steps jusqu'à un index sont validées
  const areAllPreviousStepsValidated = useCallback(
    (upToIndex: number) => {
      const steps = modal.config?.steps;
      const stepsValidation = modal.config?.stepsValidation;

      if (!steps) return false;

      for (let i = 0; i < upToIndex; i++) {
        const id = steps[i]?.id;
        if (id && !stepsValidation?.[id]) {
          return false;
        }
      }
      return true;
    },
    [modal.config?.steps, modal.config?.stepsValidation],
  );

  return {
    /** ID de la step courante */
    stepId: currentStepId,

    /** La step est-elle validée ? */
    isValidated,

    /** Marquer la step comme validée/non validée */
    setValidated,

    /** Vérifier si toutes les steps précédentes sont validées */
    areAllPreviousStepsValidated,

    /** Vérifier si une step spécifique est accessible */
    isStepAccessible: modal.isStepAccessible,
  };
}
