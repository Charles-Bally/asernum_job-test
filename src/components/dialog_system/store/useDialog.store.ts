import type {
  DialogAction,
  DialogOptions,
  DialogPromise,
  DialogResult,
  DialogStore,
} from "@/components/dialog_system/types/dialog.types";
import { create } from "zustand";

let dialogCounter = 0;

export const useDialogStore = create<DialogStore>((set, get) => ({
  dialogs: new Map(),

  show: <T = DialogAction>(options: DialogOptions): DialogPromise<T> => {
    const id = `dialog-${++dialogCounter}`;

    const promise = new Promise<DialogResult<T>>((resolve, reject) => {

      set((state: DialogStore) => {
        const newDialogs = new Map(state.dialogs);
        newDialogs.set(id, {
          ...options,
          resolve: resolve as any,
          reject,
        });
        return { dialogs: newDialogs };
      });

      if (options.onOpen) {
        options.onOpen();
      }

      // Auto-close si configuré
      if (options.autoClose && options.autoClose > 0) {
        setTimeout(() => {
          get().close(id, "close" as any);
        }, options.autoClose);
      }
    });

    // Ajouter une méthode close à la promesse
    const enhancedPromise = promise as DialogPromise<T>;
    enhancedPromise.close = (action?: T) => {
      get().close(id, (action || "close") as any);
    };

    return enhancedPromise;
  },

  close: (id: string, action: DialogAction = "close") => {
    const state = get();
    const dialog = state.dialogs.get(id);

    if (dialog) {
      const button = dialog.buttons?.find((b) => b.action === action);
      dialog.resolve({ action, button });

      if (dialog.onClose) {
        dialog.onClose();
      }

      set((state) => {
        const newDialogs = new Map(state.dialogs);
        newDialogs.delete(id);
        return { dialogs: newDialogs };
      });
    }
  },

  closeAll: () => {
    const state = get();
    state.dialogs.forEach((dialog) => {
      dialog.reject({ action: "close" });
      if (dialog.onClose) {
        dialog.onClose();
      }
    });
    set({ dialogs: new Map() });
  },
}));
