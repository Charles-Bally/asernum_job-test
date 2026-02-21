"use client";

import CustomButton from "@/components/ui/render/CustomButton";
import { cn } from "@/lib/utils";
import type { ModalConfig } from "../types/modal.types";

interface FooterButton {
  label: string;
  onClick?: () => void | Promise<void>;
  variant?: "primary" | "secondary" | "outline" | "danger";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

interface ModalFooterProps {
  /** Boutons à afficher (mode simple) */
  buttons?: FooterButton[];
  /** Configuration du modal (mode stepper) */
  config?: ModalConfig;
  /** Callbacks pour mode stepper */
  onNext?: () => void;
  onBack?: () => void;
  onCancel?: () => void;
  onSaveForLater?: () => void | Promise<void>;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  /** Contenu personnalisé pour le footer (remplace tout) */
  customContent?: React.ReactNode;
  /** Alignement des boutons */
  align?: "left" | "center" | "right" | "between";
  /** Classe CSS personnalisée */
  className?: string;
  /** Variante du footer */
  variant?: "default" | "compact";
}

/**
 * Footer réutilisable pour les modals
 * Design Figma : Footer avec boutons alignés
 *
 * @example
 * ```tsx
 * // Simple
 * <ModalFooter
 *   buttons={[
 *     { label: "Annuler", variant: "secondary", onClick: modal.close },
 *     { label: "Enregistrer", variant: "primary", onClick: handleSave }
 *   ]}
 * />
 *
 * // Avec icônes
 * <ModalFooter
 *   buttons={[
 *     {
 *       label: "Créer",
 *       variant: "primary",
 *       icon: <CustomIcon config={ICONS.actions.plus} />
 *     }
 *   ]}
 * />
 *
 * // Contenu personnalisé
 * <ModalFooter customContent={<div>Mon footer custom</div>} />
 * ```
 */
export function ModalFooter({
  buttons,
  config,
  onNext,
  onBack,
  onCancel,
  onSaveForLater,
  isFirstStep,
  isLastStep,
  customContent,
  align = "right",
  className,
  variant = "default",
}: ModalFooterProps) {
  // Si customContent est fourni, afficher uniquement ça
  if (customContent) {
    return (
      <div
        className={cn(
          "shrink-0 border-t border-slate-100 px-6 py-4",
          className,
        )}
      >
        {customContent}
      </div>
    );
  }

  // Mode stepper : générer les boutons automatiquement depuis config
  let footerButtons: FooterButton[] = [];

  // Par défaut, showCancelButton est true sauf si explicitement mis à false
  const showCancelButton = config?.showCancelButton !== false;

  // Save for later - afficher à partir de la step configurée (défaut: 1)
  const currentStep = config?.currentStep ?? 0;
  const saveForLaterFromStep = config?.saveForLaterFromStep ?? 1;
  const showSaveForLater =
    config?.showSaveForLater && currentStep >= saveForLaterFromStep;

  if (config && config.steps && config.steps.length > 0) {
    // Bouton Sauvegarder et continuer plus tard
    if (showSaveForLater && onSaveForLater) {
      footerButtons.push({
        label: config.saveForLaterLabel || "Sauvegarder",
        variant: "outline",
        onClick: onSaveForLater,
        className: "text-neutral-600",
      });
    }

    // Boutons pour le mode stepper
    // Bouton annuler/précédent (si showCancelButton est true ou si ce n'est pas la première étape)
    if (showCancelButton || !isFirstStep) {
      footerButtons.push({
        label: isFirstStep
          ? config.cancelLabel || "Annuler"
          : config.backLabel || "Précédent",
        variant: "outline",
        onClick: isFirstStep ? onCancel : onBack,
        className: isFirstStep ? config.cancelClassName : undefined,
      });
    }

    // Bouton suivant/soumettre
    footerButtons.push({
      label: isLastStep
        ? config.submitLabel || "Créer"
        : config.nextLabel || "Suivant",
      variant: "primary",
      onClick: onNext,
      icon: config.submitIcon,
      disabled: config.submitDisabled,
      className: config.submitClassName,
    });
  } else if (buttons) {
    // Mode simple : utiliser les boutons fournis
    footerButtons = buttons;
  }

  // Séparer le bouton save for later des autres boutons pour le layout mobile
  const saveForLaterButton = showSaveForLater && onSaveForLater ? {
    label: config?.saveForLaterLabel || "Sauvegarder",
    onClick: onSaveForLater,
  } : null;

  // Filtrer le bouton save for later des footerButtons (on le gère séparément)
  const mainButtons = footerButtons.filter(
    (btn) => btn.label !== (config?.saveForLaterLabel || "Sauvegarder")
  );

  return (
    <div className="flex flex-col">
      {config?.footerTopContent ? config.footerTopContent : null}
      <div
        className={cn(
          "shrink-0 border-t border-slate-100 px-6",
          className,
        )}
      >
        {/* Mobile: Bouton save for later en haut, centré comme un lien */}
        {saveForLaterButton && (
          <button
            onClick={saveForLaterButton.onClick}
            className="w-full py-3 text-center text-sm font-medium text-neutral-500 underline underline-offset-2 hover:text-neutral-700 sm:hidden"
          >
            {saveForLaterButton.label}
          </button>
        )}

        {/* Boutons principaux */}
        <div
          className={cn(
            "flex w-full items-center gap-3 py-4",
            // Sur mobile sans save for later: flex justify-end
            // Sur mobile avec save for later: grid 2 colonnes
            saveForLaterButton
              ? "grid grid-cols-2 sm:flex sm:justify-end"
              : "justify-end",
          )}
        >
          {/* Desktop only: Bouton save for later */}
          {saveForLaterButton && (
            <CustomButton
              onClick={saveForLaterButton.onClick}
              variant="outline"
              className="hidden h-12 rounded-[10px] px-[30px] py-3 text-base font-semibold text-neutral-600 sm:inline-flex"
            >
              {saveForLaterButton.label}
            </CustomButton>
          )}

          {mainButtons.map((button, index) => (
            <CustomButton
              key={`${button.label}-${index}`}
              onClick={button.onClick || (() => { })}
              variant={button.variant || "secondary"}
              type={button.type || "button"}
              disabled={button.disabled}
              icon={
                button.icon
                  ? {
                    position: "left",
                    render: button.icon,
                  }
                  : undefined
              }
              className={cn(
                "h-12 rounded-[10px] px-4 py-3 text-base font-semibold sm:px-[30px]",
                button.loading && "opacity-50",
                button.className,
              )}
            >
              {button.loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span className="line-clamp-1">{button.label}</span>
                </div>
              ) : (
                <span className="line-clamp-1">{button.label}</span>
              )}
            </CustomButton>
          ))}
        </div>
      </div>
    </div>
  );
}
