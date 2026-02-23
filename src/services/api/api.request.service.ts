import { dialog, DIALOG } from "@/components/dialog_system/services/dialog.service";
import { tanstackQueryService } from "@/services/tanstack-query.service";
import { AxiosError, AxiosResponse } from "axios";
import { requestCancellationService } from "./request-cancellation.service";

export interface ApiRequestConfig {
  /** Message affiché pendant l'attente */
  waitingMessage?: string;
  /** Titre du dialog de succès */
  successTitle?: string;
  /** Message du dialog de succès */
  successMessage?: string;
  /** Titre du dialog d'erreur */
  errorTitle?: string;
  /** Message d'erreur personnalisé (sinon utilise celui de la réponse) */
  errorMessage?: string;
  /** Afficher un dialog de succès (défaut: true) */
  showSuccessDialog?: boolean;
  /** Afficher un dialog d'erreur (défaut: true) */
  showErrorDialog?: boolean;
  /** Afficher un dialog de chargement (défaut: true) */
  showWaitingDialog?: boolean;
  /** Dialog fermable pendant le chargement (défaut: false) */
  closableWhileLoading?: boolean;
  /** Fonction appelée en cas de succès */
  showApiErrorMessage?: boolean;
  /** Fonction appelée en cas de succès */
  onSuccess?: (response: AxiosResponse) => void;
  /** Fonction appelée en cas d'erreur */
  onError?: (error: AxiosError) => void;
  onFinally?: () => void;
  /** Signal pour annuler la requête */
  signal?: AbortSignal;
  autoCloseSuccessDialog?: boolean;
  /** Config XHR pour progression (future feature) */
  xhrConfig?: {
    onProgress?: (progress: number) => void;
  };
  /** Clés de cache TanStack Query à invalider après succès */
  cacheKeys?: (string | string[])[];
  /** Clé d'annulation pour gérer automatiquement les requêtes multiples */
  cancellationKey?: string;
}

/**
 * Gestionnaire de requêtes API avec dialogs automatiques et annulation automatique
 *
 * @example
 * ```ts
 * import { apiRequest } from '@/services/api/api.request.service'
 *
 * await apiRequest({
 *   request: () => http.post('/employees', data),
 *   config: {
 *     waitingMessage: 'Création de l\'employé...',
 *     successMessage: 'Employé créé avec succès',
 *     cancellationKey: 'create-employee', // Annule automatiquement les requêtes précédentes
 *   }
 * })
 * ```
 */
export async function apiRequest<T = any>({
  request,
  config = {},
}: {
  request: (signal?: AbortSignal) => Promise<AxiosResponse<T> | any>;
  config?: ApiRequestConfig;
}): Promise<T> {
  const {
    waitingMessage = "Traitement en cours...",
    successTitle = "Succès",
    successMessage = "Opération réussie",
    errorTitle = "Erreur",
    errorMessage,
    showSuccessDialog = true,
    showErrorDialog = true,
    showWaitingDialog = true,
    closableWhileLoading = false,
    showApiErrorMessage = false,
    onSuccess,
    onError,
    onFinally,
    signal,
    cacheKeys,
    cancellationKey,
    autoCloseSuccessDialog = false,
  } = config;

  // Gérer l'annulation automatique si une clé est fournie
  let abortController: AbortController | null = null;
  let finalSignal: AbortSignal | undefined = signal;

  if (cancellationKey) {
    abortController = requestCancellationService.register(cancellationKey);
    finalSignal = abortController.signal;
  }

  // Afficher le dialog de chargement seulement si demandé
  let loadingDialog: any = null;
  if (showWaitingDialog) {
    loadingDialog = dialog({
      type: DIALOG.INFO,
      title: "Traitement en cours",
      message: waitingMessage,
      buttons: [],
      closeOnBackdropClick: closableWhileLoading,
      closeOnEsc: closableWhileLoading,
    });
  }

  try {
    // Vérifier si annulé avant la requête
    if (finalSignal?.aborted) {
      throw new Error("Request cancelled");
    }

    // Exécuter la requête
    const response = await request(finalSignal);

    if (!response) throw new Error("Un erreur est survenue");

    // Fermer le dialog de chargement si affiché
    if (loadingDialog) {
      loadingDialog.close("success");
      await loadingDialog;
    }

    // Callback de succès
    onSuccess?.(response);

    // Invalider les clés de cache TanStack Query si spécifiées
    if (cacheKeys && cacheKeys.length > 0) {
      await Promise.all(
        cacheKeys.map((key) => {
          const queryKey = Array.isArray(key) ? key : [key];
          return tanstackQueryService.invalidateQueries(queryKey);
        })
      );
    }

    // Afficher le dialog de succès
    if (showSuccessDialog) {
      await dialog({
        type: DIALOG.SUCCESS,
        title: successTitle,
        message: successMessage,
        autoClose: autoCloseSuccessDialog ? 1000 : undefined,
      });
    }

    return response.data || response;
  } catch (error) {
    // Si c'est une annulation, ne pas traiter comme une erreur
    if (requestCancellationService.isCancelError(error as AxiosError)) {
      // Fermer silencieusement le dialog de chargement
      if (loadingDialog) {
        loadingDialog.close("cancel");
      }
      // Ne pas propager l'erreur d'annulation
      throw error;
    }

    // Fermer le dialog de chargement si affiché
    if (loadingDialog) {
      loadingDialog.close("error");
      await loadingDialog;
    }

    const axiosError = error as AxiosError;

    // Callback d'erreur
    onError?.(axiosError);

    // Construire le message d'erreur
    let finalErrorMessage =
      (showApiErrorMessage && (axiosError.response?.data as any)?.message) ||
      axiosError.message ||
      "Une erreur est survenue";
    console.error("API Request Error:", axiosError);
    if (errorMessage && !showApiErrorMessage) {
      finalErrorMessage = errorMessage;
    }

    // Afficher le dialog d'erreur
    if (showErrorDialog) {
      await dialog({
        type: DIALOG.ERROR,
        title: errorTitle,
        message: finalErrorMessage,
      });
    }

    throw error;
  } finally {
    // Nettoyer le controller si une clé d'annulation était utilisée
    if (cancellationKey) {
      requestCancellationService.cleanup(cancellationKey);
    }
    onFinally?.();
  }
}
