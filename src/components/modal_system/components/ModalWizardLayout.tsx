"use client";

import CustomButton from "@/components/ui/render/CustomButton";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useMediaQuery } from "use-media-query-react";
import { useModal } from "../hooks/useModal";
import type { ModalConfig } from "../types/modal.types";
import { ModalContent } from "./ModalContent";
import { ModalSidebarStepper } from "./ModalSidebarStepper";

interface ModalWizardLayoutProps {
  config: ModalConfig;
}

export function ModalWizardLayout({ config }: ModalWizardLayoutProps) {
  const modal = useModal();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const currentStep = config.currentStep ?? 0;
  const steps = config.steps || [];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep >= steps.length - 1;

  // Sur mobile, fallback vers le layout default
  if (isMobile) {
    return <ModalContent config={{ ...config, layout: "default" }} />;
  }

  const handleClose = async () => {
    if (config.onClose) {
      await config.onClose();
      return;
    }
    modal.close();
  };

  const handleCancel = async () => {
    if (config.onCancel) {
      await config.onCancel();
      return;
    }
    if (modal.level > 0) {
      modal.pop();
    } else {
      modal.close();
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Permettre de naviguer si la step est accessible (précédente ou validée)
    if (modal.isStepAccessible(stepIndex)) {
      modal.goToStep(stepIndex);
    }
  };

  // Par défaut, showCancelButton est true sauf si explicitement mis à false
  const showCancelButton = config.showCancelButton !== false;

  // Save for later button - afficher à partir de la step configurée (défaut: 1)
  const saveForLaterFromStep = config.saveForLaterFromStep ?? 1;
  const showSaveForLater =
    config.showSaveForLater && currentStep >= saveForLaterFromStep;

  const handleSaveForLater = async () => {
    if (config.onSaveForLater) {
      await config.onSaveForLater();
    }
    modal.close();
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl bg-shade-bg",
        "flex",
        "w-full shadow-xl",
        "max-h-[90vh]",
        config.className
      )}
    >
      {/* Sidebar avec les étapes */}
      <ModalSidebarStepper config={config} onStepClick={handleStepClick} />

      {/* Zone principale (header minimal + content + footer) */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header minimal - juste le bouton X */}
        <div className="flex items-center justify-end border-b border-neutral-200 px-4 py-3 shrink-0">
          <button
            onClick={handleClose}
            className={cn(
              "flex items-center justify-center rounded-full p-[10px]",
              "border-2 border-neutral-200 hover:border-neutral-300",
              "transition-colors"
            )}
            aria-label="Fermer"
          >
            <X className="size-5 text-neutral-500" />
          </button>
        </div>

        {/* Contenu du step actuel */}
        <div
          className={cn(
            "flex-1 overflow-y-auto p-6",
            config.contentClassName
          )}
        >
          {steps.length > 0
            ? steps[currentStep]?.component || config.content
            : config.content}
        </div>

        {/* Footer avec boutons */}
        <div className="flex items-center gap-[10px] justify-end border-t border-neutral-200 p-4 shrink-0">
          {/* Bouton Sauvegarder et continuer plus tard */}
          {showSaveForLater && (
            <CustomButton
              onClick={handleSaveForLater}
              variant="outline"
              className="h-[52px] rounded-[14px] px-5 py-[14px] text-base font-semibold text-neutral-600"
            >
              {config.saveForLaterLabel || "Sauvegarder et continuer plus tard"}
            </CustomButton>
          )}

          {/* Bouton Retour/Annuler */}
          {(showCancelButton || !isFirstStep) && (
            <CustomButton
              onClick={isFirstStep ? handleCancel : modal.prevStep}
              variant="outline"
              className="h-[52px] flex-1 rounded-[14px] px-5 py-[14px] text-base font-semibold"
            >
              {isFirstStep
                ? config.cancelLabel || "Annuler"
                : config.backLabel || "Retour"}
            </CustomButton>
          )}

          {/* Bouton Suivant/Soumettre */}
          <CustomButton
            onClick={modal.nextStep}
            variant="primary"
            icon={
              config.submitIcon
                ? { position: "left", render: config.submitIcon }
                : undefined
            }
            className="h-[52px] flex-1 rounded-[14px] px-5 py-[14px] text-base font-semibold"
          >
            {isLastStep
              ? config.submitLabel || "Terminer"
              : config.nextLabel || "Suivant"}
          </CustomButton>
        </div>
      </div>
    </div>
  );
}

export default ModalWizardLayout;
