import { useDialogStore } from "@/components/dialog_system/store/useDialog.store";
import type {
  DialogAction,
  DialogOptions,
  DialogPromise,
} from "@/components/dialog_system/types/dialog.types";

/**
 * Service pour afficher des dialogs
 *
 * @example
 * ```tsx
 * import { dialog, DIALOG } from '@/dialog_system/services/dialog.service'
 *
 * // Dialog de succès
 * const result = await dialog({
 *   type: DIALOG.SUCCESS,
 *   title: 'Employé créé',
 *   message: 'L\'employé a été créé avec succès.'
 * })
 *
 * // Dialog de confirmation
 * const result = await dialog({
 *   type: DIALOG.CONFIRM,
 *   title: 'Êtes-vous sûr ?',
 *   message: 'Cette action est irréversible.'
 * })
 *
 * if (result.action === 'confirm') {
 *   // Action confirmée
 * }
 * ```
 */
export function dialog<T = DialogAction>(
  options: DialogOptions,
): DialogPromise<T> {
  return useDialogStore.getState().show<T>(options);
}

/**
 * Ferme tous les dialogs ouverts
 */
export function closeAllDialogs() {
  useDialogStore.getState().closeAll();
}

/**
 * Export des types de dialog pour faciliter l'utilisation
 */
export const DIALOG = {
  INFO: "info" as const,
  WARNING_PRIMARY: "warningPrimary" as const,
  SUCCESS: "success" as const,
  WARNING: "warning" as const,
  DANGER: "danger" as const,
  ERROR: "danger" as const, // alias
  QUESTION: "question" as const,
  CONFIRM: "confirm" as const,
  DELETE: "delete" as const,
};
