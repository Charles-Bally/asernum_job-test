"use client";

import { useDialog } from "@/components/dialog_system";
import { cn } from "@/lib/utils";
import { Check, Lock } from "lucide-react";
import { useModal } from "../hooks/useModal";
import type { ModalConfig, ModalStep } from "../types/modal.types";

interface ModalSidebarStepperProps {
  config: ModalConfig;
  onStepClick?: (stepIndex: number) => void;
}

type StepState = "completed" | "active" | "accessible" | "locked";

function getStepState(
  stepIndex: number,
  currentStep: number,
  isAccessible: boolean
): StepState {
  if (stepIndex < currentStep) return "completed";
  if (stepIndex === currentStep) return "active";
  if (isAccessible) return "accessible";
  return "locked";
}

interface StepIndicatorProps {
  state: StepState;
}

function StepIndicator({ state }: StepIndicatorProps) {
  if (state === "completed") {
    return (
      <div className="flex items-center justify-center rounded-full size-8 bg-primary-500">
        <Check className="size-4 text-white" strokeWidth={3} />
      </div>
    );
  }

  if (state === "active") {
    return (
      <div className="flex items-center justify-center rounded-full size-8 border border-primary-600 bg-white">
        <div className="rounded-full size-[10px] bg-primary-600" />
      </div>
    );
  }

  if (state === "accessible") {
    return (
      <div className="flex items-center justify-center rounded-full size-8 border border-primary-300 bg-primary-50">
        <div className="rounded-full size-[10px] bg-primary-300" />
      </div>
    );
  }

  // locked
  return (
    <div className="flex items-center justify-center rounded-full size-8 border border-neutral-200 bg-neutral-50">
      <Lock className="size-3 text-neutral-400" />
    </div>
  );
}

interface StepItemProps {
  step: ModalStep;
  stepIndex: number;
  currentStep: number;
  isFirst: boolean;
  isLast: boolean;
  isAccessible: boolean;
  onClick?: () => void;
  onLockedClick?: () => void;
}

function StepItem({
  step,
  stepIndex,
  currentStep,
  isFirst,
  isLast,
  isAccessible,
  onClick,
  onLockedClick,
}: StepItemProps) {
  const state = getStepState(stepIndex, currentStep, isAccessible);
  const isClickable = state === "completed" || state === "accessible";

  const handleClick = () => {
    if (isClickable) {
      onClick?.();
    } else if (state === "locked") {
      onLockedClick?.();
    }
  };

  return (
    <div
      className={cn(
        "flex items-center min-h-[90px] w-[240px]",
        isClickable && "cursor-pointer",
        state === "locked" && "cursor-not-allowed opacity-70"
      )}
      onClick={handleClick}
    >
      {/* Colonne indicateur + lignes */}
      <div className="flex flex-row items-center self-stretch">
        <div className="flex flex-col gap-1 h-[80px] items-center justify-center pr-4">
          {/* Ligne du haut */}
          <div className="flex-1 flex flex-col gap-[10px] items-center justify-center min-h-px min-w-px">
            {!isFirst && <div className="flex-1 w-[2px] bg-neutral-200" />}
          </div>

          {/* Indicateur circulaire */}
          <StepIndicator state={state} />

          {/* Ligne du bas */}
          <div className="flex-1 flex flex-col gap-[10px] items-center justify-center min-h-px min-w-px">
            {!isLast && <div className="flex-1 w-[2px] bg-neutral-200" />}
          </div>
        </div>
      </div>

      {/* Texte */}
      <div className="flex-1 flex flex-col gap-[2px] items-start min-h-px min-w-px">
        <p
          className={cn(
            "text-base font-bold leading-6 w-full",
            state === "locked" ? "text-neutral-400" : "text-neutral-900"
          )}
        >
          {step.label || `Étape ${String(stepIndex + 1).padStart(2, "0")}`}
        </p>
        {step.title && (
          <p
            className={cn(
              "text-sm font-normal leading-[1.3] w-full",
              state === "locked" ? "text-neutral-400" : "text-neutral-500"
            )}
          >
            {step.title}
          </p>
        )}
      </div>
    </div>
  );
}

export function ModalSidebarStepper({
  config,
  onStepClick,
}: ModalSidebarStepperProps) {
  const modal = useModal();
  const { dialog, DIALOG } = useDialog();
  const steps = config.steps || [];
  const currentStep = config.currentStep ?? 0;

  const handleLockedClick = async () => {
    await dialog({
      type: DIALOG.WARNING,
      title: "Étape non accessible",
      message: "Veuillez terminer les étapes précédentes avant de continuer.",
    });
  };

  if (steps.length === 0) return null;

  return (
    <div className="flex flex-col overflow-y-scroll gap-10 bg-white border-r border-neutral-200 p-6 shrink-0">
      <div className="flex flex-col">
        {steps.map((step, index) => (
          <StepItem
            key={step.id}
            step={step}
            stepIndex={index}
            currentStep={currentStep}
            isFirst={index === 0}
            isLast={index === steps.length - 1}
            isAccessible={modal.isStepAccessible(index)}
            onClick={() => onStepClick?.(index)}
            onLockedClick={handleLockedClick}
          />
        ))}
      </div>
    </div>
  );
}

export default ModalSidebarStepper;
