"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useModalInstance } from "../context/ModalInstanceContext";
import { useModalStore } from "../store/useModal.store";

/**
 * Type utilitaire pour générer tous les chemins possibles d'un objet imbriqué (récursif, multi-niveaux)
 * Ex: { user: { profile: { name: "" } } } => "user" | "user.profile" | "user.profile.name"
 */
export type NestedPaths<T, Depth extends number = 5> = Depth extends 0
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: K extends string | number
          ? T[K] extends object
            ? T[K] extends any[]
              ? `${K}`
              : `${K}` | `${K}.${NestedPaths<T[K], Prev[Depth]>}`
            : `${K}`
          : never;
      }[keyof T]
    : never;

/**
 * Type utilitaire pour décrémenter un nombre (utilisé pour la profondeur de récursion)
 */
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...0[]];

/**
 * Type utilitaire pour obtenir le type d'une valeur à partir d'un chemin (récursif)
 */
export type PathValue<T, P> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

/**
 * Récupérer une valeur imbriquée avec notation point (ex: "personal.firstName")
 */
export function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

/**
 * Définir une valeur imbriquée avec notation point (ex: "personal.firstName", "John")
 */
export function setNestedValue(obj: any, path: string, value: any): any {
  const keys = path.split(".");
  const lastKey = keys.pop()!;
  const target = keys.reduce((acc, key) => {
    if (!acc[key]) acc[key] = {};
    return acc[key];
  }, obj);
  target[lastKey] = value;
  return obj;
}

interface UseModalDataOptions {
  modalId?: string;
  /** Si true, lance une erreur si le modal n'est pas trouvé (défaut: true) */
  throwOnNotFound?: boolean;
}

/**
 * Hook personnalisé pour gérer les données d'un formulaire dans un modal
 * Utilise le store Zustand comme source unique de vérité
 *
 * ✨ Support des chemins imbriqués avec notation point (ex: "personal.firstName")
 * 🆕 Cross-modal access: Permet de gérer les données d'un autre modal via modalId
 *
 * @param defaultValues - Valeurs par défaut du formulaire
 * @param options - Options supplémentaires (modalId, throwOnNotFound)
 * @returns { data, updateField, updateFields, getFieldValue, reset }
 *
 * @example
 * ```tsx
 * // Utilisation normale (modal courant)
 * const { data, updateField } = useModalData({ name: "" });
 *
 * // 🆕 Cibler un autre modal par son ID
 * const parentData = useModalData({ status: "" }, { modalId: "parent-modal-id" });
 * parentData.updateField("status", "updated");
 * ```
 */
export function useModalData<T extends Record<string, any>>(
  defaultValues: T,
  options?: UseModalDataOptions,
) {
  const instance = useModalInstance();
  // ✅ Utiliser useMemo pour éviter de créer un nouvel objet à chaque rendu
  const emptyData = useMemo(() => ({}), []);
  const defaultValuesRef = useRef(defaultValues);

  useEffect(() => {
    defaultValuesRef.current = defaultValues;
  }, [defaultValues]);

  const targetModalId = options?.modalId ?? instance?.id;
  const throwOnNotFound = options?.throwOnNotFound ?? true;

  // 🆕 Valider que le modal existe
  useEffect(() => {
    if (!throwOnNotFound || !targetModalId) return;

    const store = useModalStore.getState();
    const modal = store.getModalById(targetModalId);

    // if (!modal) {
    //   throw new Error(
    //     `[useModalData] Modal avec ID "${targetModalId}" introuvable. ` +
    //       `Vérifiez que le modal existe dans la stack ou utilisez { throwOnNotFound: false }.`,
    //   );
    // }
  }, [targetModalId, throwOnNotFound]);

  const storeData = useModalStore(
    useCallback(
      (state) => {
        const resolvedId = targetModalId ?? state.config?.id;
        if (!resolvedId) {
          if (throwOnNotFound) {
            throw new Error(
              "[useModalData] Impossible de résoudre l'ID du modal. " +
                "Assurez-vous d'utiliser ce hook dans un contexte modal.",
            );
          }
          return emptyData as Partial<T>;
        }

        if (state.config?.id === resolvedId) {
          return (state.config.data ?? emptyData) as Partial<T>;
        }

        const stacked = state.stack.find((modal) => modal.id === resolvedId);
        // 🔧 Ne pas lancer d'erreur si le modal est en cours de fermeture (isOpen: false)
        // Pendant l'animation de sortie, le modal est déjà retiré de la stack
        // if (!stacked && throwOnNotFound && state.isOpen) {
        //   throw new Error(
        //     `[useModalData] Modal avec ID "${resolvedId}" introuvable dans la stack.`,
        //   );
        // }
        return (stacked?.data ?? emptyData) as Partial<T>;
      },
      [emptyData, targetModalId, throwOnNotFound],
    ),
  );

  // Initialiser les données dans le store si elles sont vides
  useEffect(() => {
    const store = useModalStore.getState();
    const resolvedId = targetModalId ?? store.config?.id;
    if (!resolvedId) {
      return;
    }

    const modal = store.getModalById(resolvedId);
    const currentData = modal?.data;

    if (!currentData || Object.keys(currentData).length === 0) {
      store.updateData(defaultValuesRef.current, resolvedId);
    }
  }, [targetModalId]);

  /**
   * Mettre à jour un champ spécifique (supporte notation point pour champs imbriqués)
   * ✨ Typage strict avec autocomplétion
   * @example updateField("name", "John") ou updateField("personal.firstName", "John")
   */
  const updateField = useCallback(
    <P extends NestedPaths<T>>(field: P, value: PathValue<T, P>) => {
      const store = useModalStore.getState();
      const resolvedId = targetModalId ?? store.config?.id;
      if (!resolvedId) {
        return;
      }

      const modal = store.getModalById(resolvedId);
      const currentData = { ...(modal?.data ?? {}) };
      const updatedData = setNestedValue(currentData, field, value);
      store.updateData(updatedData, resolvedId);
    },
    [targetModalId],
  );

  /**
   * Mettre à jour plusieurs champs à la fois
   */
  const updateFields = useCallback(
    (updates: Partial<T>) => {
      const store = useModalStore.getState();
      const resolvedId = targetModalId ?? store.config?.id;
      if (!resolvedId) {
        return;
      }
      store.updateData(updates, resolvedId);
    },
    [targetModalId],
  );

  /**
   * Récupérer la valeur actuelle d'un champ (supporte notation point)
   * ✨ Typage strict avec autocomplétion
   * @example getFieldValue("name") ou getFieldValue("personal.firstName")
   */
  const getFieldValue = useCallback(
    <P extends NestedPaths<T>>(field: P): PathValue<T, P> | undefined => {
      const store = useModalStore.getState();
      const resolvedId = targetModalId ?? store.config?.id;
      if (!resolvedId) {
        return undefined;
      }

      const modal = store.getModalById(resolvedId);
      return getNestedValue(modal?.data, field);
    },
    [targetModalId],
  );

  /**
   * Réinitialiser toutes les données aux valeurs par défaut
   */
  const reset = useCallback(() => {
    const store = useModalStore.getState();
    const resolvedId = targetModalId ?? store.config?.id;
    if (!resolvedId) {
      return;
    }

    store.updateData(defaultValuesRef.current, resolvedId);
  }, [targetModalId]);

  /**
   * Obtenir toutes les données actuelles (utile pour validation/soumission)
   */
  const getData = useCallback((): Partial<T> => {
    const store = useModalStore.getState();
    const resolvedId = targetModalId ?? store.config?.id;
    if (!resolvedId) {
      return {} as Partial<T>;
    }

    const modal = store.getModalById(resolvedId);
    return (modal?.data || {}) as Partial<T>;
  }, [targetModalId]);

  /**
   * Valider que des champs requis sont remplis (supporte notation point)
   * ✨ Typage strict avec autocomplétion
   * @example validateRequired(["name", "email"]) ou validateRequired(["personal.firstName", "personal.lastName"])
   */
  const validateRequired = useCallback(
    (requiredFields: NestedPaths<T>[]): boolean => {
      const currentData = getData();
      if (!currentData) return false;

      return requiredFields.every((field) => {
        const value = getNestedValue(currentData, field);
        return value !== null && value !== undefined && value !== "";
      });
    },
    [getData],
  );

  return {
    /** Données actuelles du formulaire (pour affichage) */
    data: storeData,

    /** Mettre à jour un champ spécifique (supporte notation point) */
    updateField,

    /** Mettre à jour plusieurs champs */
    updateFields,

    /** Récupérer la valeur d'un champ (supporte notation point) */
    getFieldValue,

    /** Réinitialiser aux valeurs par défaut */
    reset,

    /** Obtenir toutes les données actuelles */
    getData,

    /** Valider les champs requis (supporte notation point) */
    validateRequired,

    /** Helper pour récupérer une valeur imbriquée dans le JSX */
    getValue: <P extends NestedPaths<T>>(
      path: P,
    ): PathValue<T, P> | undefined =>
      getNestedValue(storeData, path) as PathValue<T, P> | undefined,
  };
}
