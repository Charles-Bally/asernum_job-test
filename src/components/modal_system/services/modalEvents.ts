/**
 * Système d'événements pour la communication cross-modal
 * Permet aux modals de communiquer entre eux de manière découplée
 *
 * @example
 * ```tsx
 * // Dans Modal A
 * modalEvents.emit("user-updated", { userId: "123", name: "John" });
 *
 * // Dans Modal B
 * const unsubscribe = modalEvents.on("user-updated", (data) => {
 *   console.log("User updated:", data);
 * });
 * ```
 */

export type ModalEventCallback<T = any> = (data: T) => void;

export interface ModalEventSubscription {
  unsubscribe: () => void;
}

interface EventListener<T = any> {
  id: string;
  callback: ModalEventCallback<T>;
  once?: boolean;
}

class ModalEventBus {
  private listeners: Map<string, EventListener[]> = new Map();
  private eventHistory: Map<string, any[]> = new Map();
  private maxHistorySize = 50;

  /**
   * S'abonner à un événement
   * @param event - Nom de l'événement
   * @param callback - Fonction à exécuter lors de l'émission
   * @returns Objet avec méthode unsubscribe
   */
  on<T = any>(
    event: string,
    callback: ModalEventCallback<T>,
  ): ModalEventSubscription {
    const id = this.generateId();
    const listener: EventListener<T> = { id, callback };

    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event)!.push(listener);

    return {
      unsubscribe: () => this.off(event, id),
    };
  }

  /**
   * S'abonner à un événement (une seule fois)
   * @param event - Nom de l'événement
   * @param callback - Fonction à exécuter lors de la première émission
   * @returns Objet avec méthode unsubscribe
   */
  once<T = any>(
    event: string,
    callback: ModalEventCallback<T>,
  ): ModalEventSubscription {
    const id = this.generateId();
    const listener: EventListener<T> = { id, callback, once: true };

    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event)!.push(listener);

    return {
      unsubscribe: () => this.off(event, id),
    };
  }

  /**
   * Se désabonner d'un événement
   * @param event - Nom de l'événement
   * @param listenerId - ID du listener à retirer
   */
  private off(event: string, listenerId: string): void {
    const listeners = this.listeners.get(event);
    if (!listeners) return;

    const filtered = listeners.filter((l) => l.id !== listenerId);

    if (filtered.length === 0) {
      this.listeners.delete(event);
    } else {
      this.listeners.set(event, filtered);
    }
  }

  /**
   * Émettre un événement
   * @param event - Nom de l'événement
   * @param data - Données à transmettre
   */
  emit<T = any>(event: string, data: T): void {
    // Enregistrer dans l'historique
    this.addToHistory(event, data);

    const listeners = this.listeners.get(event);
    if (!listeners || listeners.length === 0) return;

    // Exécuter tous les callbacks
    const toRemove: string[] = [];

    listeners.forEach((listener) => {
      try {
        listener.callback(data);

        // Si c'est un listener "once", le marquer pour suppression
        if (listener.once) {
          toRemove.push(listener.id);
        }
      } catch (error) {
        console.error(`[ModalEventBus] Erreur dans le listener de "${event}":`, error);
      }
    });

    // Retirer les listeners "once"
    if (toRemove.length > 0) {
      const remaining = listeners.filter((l) => !toRemove.includes(l.id));
      if (remaining.length === 0) {
        this.listeners.delete(event);
      } else {
        this.listeners.set(event, remaining);
      }
    }
  }

  /**
   * Retirer tous les listeners d'un événement spécifique
   * @param event - Nom de l'événement
   */
  clear(event: string): void {
    this.listeners.delete(event);
  }

  /**
   * Retirer tous les listeners de tous les événements
   */
  clearAll(): void {
    this.listeners.clear();
    this.eventHistory.clear();
  }

  /**
   * Récupérer l'historique d'un événement
   * @param event - Nom de l'événement
   * @param limit - Nombre maximum d'entrées à retourner
   */
  getHistory<T = any>(event: string, limit?: number): T[] {
    const history = this.eventHistory.get(event) || [];
    return limit ? history.slice(-limit) : history;
  }

  /**
   * Ajouter un événement à l'historique
   */
  private addToHistory(event: string, data: any): void {
    if (!this.eventHistory.has(event)) {
      this.eventHistory.set(event, []);
    }

    const history = this.eventHistory.get(event)!;
    history.push(data);

    // Limiter la taille de l'historique
    if (history.length > this.maxHistorySize) {
      history.shift();
    }
  }

  /**
   * Générer un ID unique pour un listener
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Obtenir le nombre de listeners pour un événement
   * @param event - Nom de l'événement
   */
  getListenerCount(event: string): number {
    return this.listeners.get(event)?.length || 0;
  }

  /**
   * Obtenir tous les noms d'événements actifs
   */
  getActiveEvents(): string[] {
    return Array.from(this.listeners.keys());
  }
}

/**
 * Instance globale du bus d'événements
 */
export const modalEvents = new ModalEventBus();

/**
 * Types d'événements prédéfinis pour le système de modals
 */
export const MODAL_EVENTS = {
  // Événements de cycle de vie
  MODAL_OPENED: "modal:opened",
  MODAL_CLOSED: "modal:closed",
  MODAL_PUSHED: "modal:pushed",
  MODAL_POPPED: "modal:popped",

  // Événements de navigation
  TAB_CHANGED: "modal:tab-changed",
  STEP_CHANGED: "modal:step-changed",

  // Événements de données
  DATA_UPDATED: "modal:data-updated",
  CONFIG_UPDATED: "modal:config-updated",

  // Événements custom (exemples)
  USER_UPDATED: "user:updated",
  FORM_SUBMITTED: "form:submitted",
  VALIDATION_FAILED: "validation:failed",
} as const;

export type ModalEventType = (typeof MODAL_EVENTS)[keyof typeof MODAL_EVENTS];
