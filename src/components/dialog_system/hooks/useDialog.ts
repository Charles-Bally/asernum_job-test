import { dialog, DIALOG } from "@/dialog_system/services/dialog.service";

/**
 * Hook React pour utiliser le système de dialog
 *
 * @example
 * ```tsx
 * const { dialog, DIALOG } = useDialog();
 *
 * const handleDelete = async () => {
 *   const result = await dialog({
 *     type: DIALOG.DELETE,
 *     title: "Supprimer",
 *     message: "Êtes-vous sûr ?"
 *   });
 *
 *   if (result.action === 'confirm') {
 *     // Action de suppression
 *   }
 * };
 * ```
 */
export function useDialog() {
  return {
    dialog,
    DIALOG,
  };
}
