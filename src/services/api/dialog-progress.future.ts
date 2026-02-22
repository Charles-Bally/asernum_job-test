import { dialog, DIALOG } from "@/components/dialog_system/services/dialog.service";
import { AxiosProgressEvent, AxiosRequestConfig } from "axios";

/**
 * Configuration pour un dialog avec progression XHR
 *
 * @example
 * ```ts
 * const progressDialog = await dialogWithProgress({
 *   title: "Upload en cours",
 *   request: () => http.post('/upload', formData, {
 *     onUploadProgress: (progress) => {
 *       console.log(progress.loaded, progress.total);
 *     }
 *   })
 * });
 * ```
 */

export interface DialogProgressConfig extends AxiosRequestConfig {
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

/**
 * TODO: Implémenter un type de dialog spécial pour les requêtes avec progression
 *
 * Fonctionnalités à ajouter :
 * 1. Dialog non fermable pendant le chargement
 * 2. Barre de progression basée sur XHR progress events
 * 3. Affichage du pourcentage (0-100%)
 * 4. Possibilité d'annuler la requête
 * 5. Estimation du temps restant
 *
 * Exemple d'utilisation future :
 *
 * ```ts
 * await dialog({
 *   type: DIALOG.PROGRESS,
 *   title: "Upload du fichier",
 *   message: "Veuillez patienter...",
 *   xhr: {
 *     request: () => http.post('/upload', formData),
 *     onProgress: (percent, loaded, total) => {
 *       console.log(`${percent}% - ${loaded}/${total} bytes`);
 *     },
 *     cancelable: true,
 *   }
 * });
 * ```
 *
 * Modifications nécessaires dans le système de dialogs :
 *
 * 1. Ajouter le type PROGRESS dans dialog.types.ts
 * 2. Créer un composant ProgressDialog avec barre de progression
 * 3. Modifier le DialogService pour gérer les requêtes XHR
 * 4. Ajouter un système d'annulation de requête (AbortController)
 */

/**
 * Version simplifiée actuelle (sans progression visuelle)
 * À améliorer plus tard si nécessaire
 */
export async function dialogWithBasicProgress<T = any>({
  title = "Chargement",
  message = "Veuillez patienter...",
  request,
  _onProgress,
}: {
  title?: string;
  message?: string;
  request: () => Promise<T>;
  _onProgress?: (percent: number) => void;
}): Promise<T> {
  const loadingDialog = dialog({
    type: DIALOG.INFO,
    title,
    message,
    buttons: [],
    closeOnBackdropClick: false,
    closeOnEsc: false,
  });

  try {
    const result = await request();
    loadingDialog.close("success");
    await loadingDialog;
    return result;
  } catch (error) {
    loadingDialog.close("error");
    await loadingDialog;
    throw error;
  }
}
