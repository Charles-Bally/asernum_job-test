"use client";

import { DialogContent } from "@/components/dialog_system/components/DialogContent";
import { useDialogStore } from "@/components/dialog_system/store/useDialog.store";
import type { DialogOptions } from "@/components/dialog_system/types/dialog.types";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

export function Dialog() {
  const portalEl = useSyncExternalStore(
    () => () => {},
    () => {
      let el = document.getElementById("dialog-root");
      if (!el) {
        el = document.createElement("div");
        el.setAttribute("id", "dialog-root");
        document.body.appendChild(el);
      }
      return el;
    },
    () => null,
  );
  const [closingDialogs, setClosingDialogs] = useState<Set<string>>(new Set());
  const { dialogs, close } = useDialogStore();

  const handleDialogClose = useCallback(
    (id: string, action: string) => {
      setClosingDialogs((prev) => new Set(prev).add(id));

      setTimeout(() => {
        close(id, action);
        setClosingDialogs((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 200);
    },
    [close],
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const dialogsArray = Array.from(dialogs.entries());
        const lastDialog = dialogsArray[dialogsArray.length - 1];
        if (lastDialog) {
          const [id, dialog] = lastDialog as [string, DialogOptions];
          if (dialog.closeOnEsc !== false) {
            handleDialogClose(id, "cancel");
          }
        }
      }
    };

    if (dialogs.size > 0) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [dialogs, handleDialogClose]);

  if (!portalEl || (dialogs.size === 0 && closingDialogs.size === 0))
    return null;

  type DialogEntry = [string, DialogOptions];
  const dialogsArray = Array.from(dialogs.entries()) as DialogEntry[];

  const content = (
    <>
      {dialogsArray.map(([id, dialog], index) => {
        const isTopDialog = index === dialogsArray.length - 1;
        const isClosing = closingDialogs.has(id);

        const handleAction = (action: string) => {
          handleDialogClose(id, action);
        };

        const handleBackdropClick = () => {
          if (dialog.closeOnBackdropClick !== false) {
            handleDialogClose(id, "cancel");
          }
        };

        return (
          <div
            key={id}
            className={cn(
              "fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200",
              isClosing
                ? "opacity-0"
                : isTopDialog
                  ? "opacity-100"
                  : "pointer-events-none opacity-50",
            )}
            style={{ zIndex: 3000 + index }}
          >
            {/* Backdrop avec animation */}
            <div
              className={cn(
                "absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity duration-200",
                isClosing
                  ? "opacity-0"
                  : isTopDialog
                    ? "opacity-100"
                    : "opacity-0",
              )}
              onClick={isTopDialog ? handleBackdropClick : undefined}
            />

            {/* Dialog avec animation scale et fade */}
            <div
              className={cn(
                "relative z-10 flex w-full items-center justify-center p-4 transition-all duration-200",
                isClosing
                  ? "scale-95 opacity-0"
                  : "animate-in fade-in zoom-in-95 scale-100 opacity-100",
              )}
            >
              <DialogContent options={dialog} onAction={handleAction} />
            </div>
          </div>
        );
      })}
    </>
  );

  return createPortal(content, portalEl);
}
