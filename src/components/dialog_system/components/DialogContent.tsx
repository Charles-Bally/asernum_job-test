"use client";

import { DialogIcon } from "@/components/dialog_system/components/DialogIcon";
import type {
  DialogButton,
  DialogOptions,
} from "@/components/dialog_system/types/dialog.types";
import CustomButton from "@/components/ui/render/CustomButton";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface DialogContentProps {
  options: DialogOptions;
  onAction: (action: string, button?: DialogButton) => void;
}

export function DialogContent({ options, onAction }: DialogContentProps) {
  const dialogType = options.type || "info";
  const title = options.title;
  const description = options.description || options.message;
  const icon = options.icon;
  const className = options.className;
  const contentClassName = options.contentClassName;

  const autoFocusIndex =
    options.buttons?.findIndex((b) => b.autoFocus || b.action === "confirm") ??
    -1;

  useEffect(() => {
    // Auto-focus sur le premier bouton
    const targetIndex = autoFocusIndex >= 0 ? autoFocusIndex : 0;
    const button = document.querySelector(
      `[data-dialog-button="${targetIndex}"]`,
    ) as HTMLButtonElement;
    if (button) {
      button.focus();
    }
  }, [autoFocusIndex]);

  // Configurations par défaut selon le type
  const getDefaultConfig = () => {
    switch (dialogType) {
      case "success":
        return {
          title: title || "Succès",
          buttons: [
            {
              label: "C'est compris",
              action: "confirm",
              variant: "primary" as const,
            },
          ],
        };
      case "danger":
        return {
          title: title || "Erreur",
          buttons: [
            {
              label: "C'est compris",
              action: "confirm",
              variant: "danger" as const,
            },
          ],
        };
      case "warning":
        return {
          title: title || "Attention",
          buttons: [
            {
              label: "C'est compris",
              action: "confirm",
              variant: "primary" as const,
            },
          ],
        };
      case "confirm":
      case "question":
        return {
          title: title || "Confirmation",
          buttons: [
            { label: "Annuler", action: "cancel", variant: "outline" as const },
            {
              label: "Confirmer",
              action: "confirm",
              variant: "primary" as const,
            },
          ],
        };
      case "delete":
        return {
          title: title || "Supprimer",
          buttons: [
            { label: "Annuler", action: "cancel", variant: "outline" as const },
            {
              label: "Oui, supprimer",
              action: "confirm",
              variant: "danger" as const,
            },
          ],
        };
      case "info":
      default:
        return {
          title: title || "Information",
          buttons: [
            {
              label: "C'est compris",
              action: "confirm",
              variant: "primary" as const,
            },
          ],
        };
    }
  };

  const defaultConfig = getDefaultConfig();
  const finalTitle = title || defaultConfig.title;
  const finalButtons =
    options.buttons && options.buttons.length > 0
      ? options.buttons
      : defaultConfig.buttons;

  // Déterminer le variant du bouton en fonction du type du dialog
  const getButtonVariant = (button: DialogButton): any => {
    if (button.variant) return button.variant;
    if (dialogType === "danger" || dialogType === "delete") return "danger";
    if (button.action === "confirm") return "primary";
    return "outline";
  };

  return (
    <div
      className={cn(
        "relative box-border flex w-full max-w-[450px] flex-col items-center gap-8 rounded-2xl border border-border-light bg-white px-5 pt-8 pb-5",
        className,
      )}
    >
      {/* Content */}
      <div
        className={cn(
          "relative flex w-full shrink-0 flex-col items-center gap-4",
          contentClassName,
        )}
      >
        {/* Icon */}
        <DialogIcon type={dialogType} config={icon} />

        {/* Text Content */}
        <div className="relative flex w-full shrink-0 flex-col items-start gap-2 text-center">
          <h2 className="w-full text-2xl leading-8 font-bold text-foreground">
            {finalTitle}
          </h2>
          {description && (
            <p className="w-full text-base leading-6 font-normal whitespace-pre-line text-text-secondary">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div
        className={cn(
          "relative flex w-full shrink-0 items-center",
          finalButtons.length > 1 ? "gap-4" : "gap-0",
        )}
      >
        {finalButtons.map((button, index) => {
          const btnData = button as DialogButton;
          return (
            <div
              key={index}
              data-dialog-button={index}
              className={cn(finalButtons.length > 1 ? "flex-1" : "w-full")}
            >
              <CustomButton
                onClick={() =>
                  onAction(btnData.action || `button-${index}`, btnData)
                }
                disabled={btnData.disabled}
                loading={btnData.loading}
                variant={getButtonVariant(btnData)}
                className="h-14 w-full rounded-xl px-4 py-2 text-base leading-6 font-semibold"
              >
                {btnData.label}
              </CustomButton>
            </div>
          );
        })}
      </div>
    </div>
  );
}
