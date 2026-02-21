"use client";

import { useModalStore } from "@/components/modal_system/store/useModal.store";
import { useCallback, useEffect, useState } from "react";

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

  // Accès au store du modal
  const modalConfig = useModalStore((state) => state.config);

  // Synchroniser formData avec les données du store quand elles changent
  useEffect(() => {
    if (modalConfig?.data) {
      setFormData((prevData) => ({
        ...prevData,
        ...modalConfig.data,
      }));
    }
  }, [modalConfig?.data]);

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
        const value = formData[field];
        return value !== null && value !== undefined && value !== "";
      });
    },
    [formData],
  );

  // Obtenir les valeurs actuelles (utile pour la validation)
  const getValues = useCallback(() => formData, [formData]);

  return {
    /** Données actuelles du formulaire */
    formData,

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
