"use client";

import type { ModalConfig } from "@/components/modal_system/types/modal.types";

interface ModalStepperProps {
  config: ModalConfig;
}

/**
 * Barre de progression pour les modals avec steppers
 * Design Figma exact : h-[4px] (h-1), bg-[#f1f0fe], active bg-[#7065f0]
 */
export function ModalStepper({ config }: ModalStepperProps) {
  if (!config.showStepper || !config.steps || config.steps.length <= 1) {
    return null;
  }

  const currentStep = config.currentStep ?? 0;
  const totalSteps = config.steps.length;
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="relative h-1 w-full shrink-0">
      {/* Background - Figma exact: #f1f0fe (Primary/50) */}
      <div className="absolute inset-0 bg-[#f1f0fe]" />

      {/* Progress - Figma exact: #7065f0 (Primary/500) */}
      <div
        className="absolute left-0 top-0 h-full bg-[#7065f0] transition-all duration-300 ease-out"
        style={{ width: `${progressPercentage}%`, backgroundColor: "#7065f0" }}
      />
    </div>
  );
}
