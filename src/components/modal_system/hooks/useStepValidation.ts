"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
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
  const setStepValidatedRef = useRef(modal.setStepValidated);

  useEffect(() => {
    setStepValidatedRef.current = modal.setStepValidated;
  }, [modal.setStepValidated]);

  const setValidated = useCallback(
    (validated: boolean) => {
      if (currentStepId) {
        setStepValidatedRef.current(currentStepId, validated);
      }
    },
    [currentStepId],
  );

  // Vérifier si toutes les steps jusqu'à un index sont validées
  const configSteps = modal.config?.steps;
  const configStepsValidation = modal.config?.stepsValidation;

  const areAllPreviousStepsValidated = useCallback(
    (upToIndex: number) => {
      if (!configSteps) return false;

      for (let i = 0; i < upToIndex; i++) {
        const id = configSteps[i]?.id;
        if (id && !configStepsValidation?.[id]) {
          return false;
        }
      }
      return true;
    },
    [configSteps, configStepsValidation],
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
