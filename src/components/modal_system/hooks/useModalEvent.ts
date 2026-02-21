"use client";

import { useEffect, useRef, useCallback } from "react";
import { modalEvents, ModalEventCallback } from "../services/modalEvents";

/**
 * Hook pour s'abonner à un événement modal
 * Se désabonne automatiquement au démontage du composant
 *
 * @param event - Nom de l'événement
 * @param callback - Fonction à exécuter lors de l'émission
 * @param dependencies - Dépendances pour recréer le callback
 *
 * @example
 * ```tsx
 * useModalEvent("user-updated", (data) => {
 *   console.log("User updated:", data);
 *   setUser(data);
 * }, [setUser]);
 * ```
 */
export function useModalEvent<T = any>(
  event: string,
  callback: ModalEventCallback<T>,
  dependencies: any[] = [],
) {
  const callbackRef = useRef(callback);

  // Mettre à jour la ref quand le callback change
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const subscription = modalEvents.on<T>(event, (data) => {
      callbackRef.current(data);
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, ...dependencies]);
}

/**
 * Hook pour s'abonner à un événement modal (une seule fois)
 * Se désabonne automatiquement après la première émission ou au démontage
 *
 * @param event - Nom de l'événement
 * @param callback - Fonction à exécuter lors de la première émission
 * @param dependencies - Dépendances pour recréer le callback
 *
 * @example
 * ```tsx
 * useModalEventOnce("form-submitted", (data) => {
 *   console.log("Form submitted once:", data);
 *   navigate("/success");
 * }, [navigate]);
 * ```
 */
export function useModalEventOnce<T = any>(
  event: string,
  callback: ModalEventCallback<T>,
  dependencies: any[] = [],
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const subscription = modalEvents.once<T>(event, (data) => {
      callbackRef.current(data);
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, ...dependencies]);
}

/**
 * Hook pour émettre des événements modals
 * Retourne une fonction d'émission mémorisée
 *
 * @returns Fonction pour émettre un événement
 *
 * @example
 * ```tsx
 * const emit = useModalEventEmitter();
 *
 * const handleSubmit = () => {
 *   emit("form-submitted", { userId: "123", name: "John" });
 * };
 * ```
 */
export function useModalEventEmitter() {
  const emit = useCallback(<T = any>(event: string, data: T) => {
    modalEvents.emit(event, data);
  }, []);

  return emit;
}

/**
 * Hook pour accéder à l'historique d'un événement
 *
 * @param event - Nom de l'événement
 * @param limit - Nombre maximum d'entrées à retourner
 *
 * @example
 * ```tsx
 * const history = useModalEventHistory("user-updated", 10);
 * ```
 */
export function useModalEventHistory<T = any>(
  event: string,
  limit?: number,
): T[] {
  return modalEvents.getHistory<T>(event, limit);
}

/**
 * Hook pour nettoyer les listeners d'un événement
 * Utile pour le nettoyage au démontage d'un composant
 *
 * @param event - Nom de l'événement à nettoyer
 *
 * @example
 * ```tsx
 * const clearUserEvents = useModalEventClear("user-updated");
 *
 * useEffect(() => {
 *   return () => {
 *     clearUserEvents();
 *   };
 * }, [clearUserEvents]);
 * ```
 */
export function useModalEventClear(event: string) {
  const clear = useCallback(() => {
    modalEvents.clear(event);
  }, [event]);

  return clear;
}
