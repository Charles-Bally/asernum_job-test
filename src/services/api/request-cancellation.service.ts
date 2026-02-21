import { AxiosError } from "axios";

/**
 * Service de gestion de l'annulation des requêtes HTTP
 *
 * Permet d'annuler automatiquement les requêtes en cours
 * lorsqu'une nouvelle requête avec la même clé est lancée.
 *
 * @example
 * ```ts
 * const controller = requestCancellationService.register('user-details')
 * await http.get('/users/123', { signal: controller.signal })
 * ```
 */
class RequestCancellationService {
  private controllers = new Map<string, AbortController>();

  /**
   * Enregistre une nouvelle requête et annule la précédente si elle existe
   *
   * @param key - Identifiant unique de la requête
   * @returns Un AbortController pour la nouvelle requête
   */
  register(key: string): AbortController {
    // Annuler la requête précédente si elle existe
    const existing = this.controllers.get(key);
    if (existing) {
      existing.abort();
    }

    // Créer un nouveau controller
    const controller = new AbortController();
    this.controllers.set(key, controller);

    return controller;
  }

  /**
   * Nettoie un controller après utilisation
   *
   * @param key - Identifiant de la requête
   */
  cleanup(key: string): void {
    this.controllers.delete(key);
  }

  /**
   * Annule toutes les requêtes en cours
   */
  cancelAll(): void {
    this.controllers.forEach((controller) => controller.abort());
    this.controllers.clear();
  }

  /**
   * Vérifie si une erreur est due à une annulation
   */
  isCancelError(error: AxiosError): boolean {
    return (
      error.name === "AbortError" ||
      error.name === "CanceledError" ||
      error.code === "ERR_CANCELED" ||
      error.message === "canceled" ||
      error.message === "Request cancelled"
    );
  }
}

export const requestCancellationService = new RequestCancellationService();
