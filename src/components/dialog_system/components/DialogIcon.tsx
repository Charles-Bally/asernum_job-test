"use client";

import type {
  DialogIconConfig,
  DialogType,
} from "@/components/dialog_system/types/dialog.types";
import CustomIcon from "@/components/ui/render/CustomIcon";
import ICONS from "@/constants/icons.constant";

interface DialogIconProps {
  type: DialogType;
  config?: DialogIconConfig;
}

type VariantColors = {
  icon: (typeof ICONS.dialogs)[keyof typeof ICONS.dialogs];
  borderColor: string;
  innerBorder: string;
  gradientFrom: string;
  gradientTo: string;
}

const SUCCESS_COLORS = {
  borderColor: "var(--dialog-success-light)",
  innerBorder: "var(--dialog-success-light)",
  gradientFrom: "var(--dialog-success-lighter)",
  gradientTo: "var(--dialog-success-light)",
}

const DANGER_COLORS = {
  borderColor: "var(--dialog-danger-light)",
  innerBorder: "var(--dialog-danger-light)",
  gradientFrom: "var(--dialog-danger-lighter)",
  gradientTo: "var(--dialog-danger-light)",
}

const WARNING_COLORS = {
  borderColor: "var(--dialog-warning-light)",
  innerBorder: "var(--dialog-warning-light)",
  gradientFrom: "var(--dialog-warning-lighter)",
  gradientTo: "var(--dialog-warning-light)",
}

const INFO_COLORS = {
  borderColor: "var(--dialog-info-light)",
  innerBorder: "var(--dialog-info-light)",
  gradientFrom: "var(--dialog-info-lighter)",
  gradientTo: "var(--dialog-info-light)",
}

export function DialogIcon({ type, config }: DialogIconProps) {
  const variantConfig: Record<DialogType, VariantColors> = {
    success: { icon: ICONS.dialogs.checkSuccess, ...SUCCESS_COLORS },
    info: { icon: ICONS.dialogs.info, ...INFO_COLORS },
    warning: { icon: ICONS.dialogs.warningTriangle, ...WARNING_COLORS },
    warningPrimary: { icon: ICONS.dialogs.warningTrianglePrimary, ...INFO_COLORS },
    danger: { icon: ICONS.dialogs.warningTriangle, ...DANGER_COLORS },
    question: { icon: ICONS.dialogs.question, ...INFO_COLORS },
    confirm: { icon: ICONS.dialogs.question, ...INFO_COLORS },
    delete: { icon: ICONS.dialogs.trashDanger, ...DANGER_COLORS },
  };

  const variant = variantConfig[type];

  let iconToUse = variant.icon;
  if (config?.type) {
    const iconMap: Record<string, (typeof ICONS.dialogs)[keyof typeof ICONS.dialogs]> = {
      user: ICONS.dialogs.userSuccess,
      userPrimary: ICONS.dialogs.userPrimary,
      trash: ICONS.dialogs.trashDelete,
      trashDanger: ICONS.dialogs.trashDanger,
      trashSuccess: ICONS.dialogs.trashSuccess,
      warning: ICONS.dialogs.warningTriangle,
      check: ICONS.dialogs.checkSuccess,
      lock: ICONS.dialogs.lockWarning,
      lockPrimary: ICONS.dialogs.lockPrimary,
      info: ICONS.dialogs.info,
      question: ICONS.dialogs.question,
    };
    iconToUse = iconMap[config.type] || variant.icon;
  }

  const content = config?.customIcon ? (
    <div className="relative h-6 w-6 shrink-0 overflow-clip">{config.customIcon}</div>
  ) : (
    <div className="relative h-6 w-6 shrink-0 overflow-clip">
      <CustomIcon config={iconToUse} className="h-6 w-6" />
    </div>
  );

  return (
    <div
      className="relative shrink-0 rounded-full border border-solid"
      style={{
        borderColor: variant.borderColor,
        backgroundImage: `linear-gradient(to bottom, ${variant.gradientTo}, ${variant.gradientFrom} 100%)`,
      }}
    >
      <div className="box-border flex items-start gap-4 overflow-clip rounded-[inherit] p-4">
        <div
          className="relative shrink-0 rounded-full border border-solid bg-white"
          style={{ borderColor: variant.innerBorder }}
        >
          <div className="box-border flex items-center justify-center gap-[14px] overflow-clip rounded-[inherit] p-[14px]">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
