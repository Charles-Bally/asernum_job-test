"use client";

import { ModalFooter } from "@/components/modal_system/components/ModalFooter";
import { ModalHeader } from "@/components/modal_system/components/ModalHeader";
import { ModalStepper } from "@/components/modal_system/components/ModalStepper";
import { ModalWizardLayout } from "@/components/modal_system/components/ModalWizardLayout";
import type { ModalConfig } from "@/components/modal_system/types/modal.types";
import { cn } from "@/lib/utils";
import { useModal } from "../hooks/useModal";

interface ModalContentProps {
  config: ModalConfig;
}

export function ModalContent({ config }: ModalContentProps) {
  const modal = useModal();

  // Layout wizard : utiliser le layout avec sidebar
  if (config.layout === "wizard" && config.steps && config.steps.length > 0) {
    return <ModalWizardLayout config={config} />;
  }

  const currentStep = config.currentStep ?? 0;
  const steps = config.steps || [];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep >= steps.length - 1;

  const handleClose = async () => {
    if (config.onClose) {
      await config.onClose();
      return;
    }

    if (modal.level > 0) {
      modal.pop();
    } else {
      modal.close();
    }
  };

  const handleCancel = async () => {
    if (config.onCancel) {
      await config.onCancel();
      return;
    }

    // Auto-detect: if modal was pushed, pop back to parent, otherwise close all
    if (modal.level > 0) {
      modal.pop();
    } else {
      modal.close();
    }
  };

  const handleSaveForLater = async () => {
    if (config.onSaveForLater) {
      await config.onSaveForLater();
    }
    modal.close();
  };

  return (
    <div
      style={{
        maxHeight: "95dvh"
      }}
      className={cn(
        "overflow-hidden rounded-2xl bg-white",
        "flex flex-col",
        "w-full shadow-xl",

        config.className,
      )}
    >
      {/* Header */}
      <ModalHeader config={config} onClose={handleClose} />

      {/* Progress Bar / Stepper */}
      {config.showStepper && <ModalStepper config={config} />}

      {/* Content */}
      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto",
          "sm:px-6 px-4 sm:py-4 py-3",
          config.contentClassName,
        )}
      >
        {/* Steps */}
        {steps.length > 0
          ? steps[currentStep]?.component || config.content
          : config.content}
      </div>

      {/* Footer */}
      <ModalFooter
        config={config}
        onNext={modal.nextStep}
        onBack={modal.prevStep}
        onCancel={handleCancel}
        onSaveForLater={handleSaveForLater}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        customContent={config.customFooter ? config.footerContent : undefined}
        className={config.customFooterClassName}
      />
    </div>
  );
}
