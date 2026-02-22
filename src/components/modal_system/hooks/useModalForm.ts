"use client";

import { useModalStore } from "@/components/modal_system/store/useModal.store";
import { useCallback, useMemo, useState } from "react";

/**
 * Hook pour gérer les données d'un formulaire dans un modal
 * Synchronise automatiquement avec le store du modal
 *
 * @param defaultValues - Valeurs par défaut du formulaire
 * @returns Objet avec formData, updateField, resetForm, etc.
 *
 * @example
 * ```tsx
 * const { formData, updateField, resetForm } = useModalForm({
 *   name: "",
 *   email: "",
 *   age: 0
 * });
 *
 * // Dans le JSX
 * <input
 *   value={formData.name}
 *   onChange={(e) => updateField("name", e.target.value)}
 * />
 * ```
 */
export function useModalForm<T extends Record<string, any>>(defaultValues: T) {
  // État local du formulaire
  const [formData, setFormData] = useState<T>(defaultValues);

  // Accès au store du modal — dériver les données directement
  const modalData = useModalStore((state) => state.config?.data);

  // Synchroniser formData avec les données du store via useMemo
  const mergedFormData = useMemo(() => {
    if (modalData) {
      return { ...formData, ...modalData } as T;
    }
    return formData;
  }, [formData, modalData]);

  // Mettre à jour un champ spécifique
  const updateField = useCallback(
    <K extends keyof T>(field: K, value: T[K]) => {
      setFormData((prev) => {
        const newData = { ...prev, [field]: value };
        // Mettre à jour le store du modal
        useModalStore.getState().updateData(newData);
        return newData;
      });
    },
    [],
  );

  // Mettre à jour plusieurs champs à la fois
  const updateFields = useCallback((updates: Partial<T>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...updates };
      // Mettre à jour le store du modal
      useModalStore.getState().updateData(newData);
      return newData;
    });
  }, []);

  // Réinitialiser le formulaire aux valeurs par défaut
  const resetForm = useCallback(() => {
    setFormData(defaultValues);
    useModalStore.getState().updateData(defaultValues);
  }, [defaultValues]);

  // Valider que tous les champs requis sont remplis
  const validateRequired = useCallback(
    (requiredFields: (keyof T)[]) => {
      return requiredFields.every((field) => {
        const value = mergedFormData[field];
        return value !== null && value !== undefined && value !== "";
      });
    },
    [mergedFormData],
  );

  // Obtenir les valeurs actuelles (utile pour la validation)
  const getValues = useCallback(() => mergedFormData, [mergedFormData]);

  return {
    /** Données actuelles du formulaire */
    formData: mergedFormData,

    /** Mettre à jour un champ spécifique */
    updateField,

    /** Mettre à jour plusieurs champs */
    updateFields,

    /** Réinitialiser le formulaire */
    resetForm,

    /** Valider que les champs requis sont remplis */
    validateRequired,

    /** Obtenir les valeurs actuelles */
    getValues,
  };
}
