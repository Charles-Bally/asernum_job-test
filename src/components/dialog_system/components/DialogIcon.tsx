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

/**
 * Composant d'icône pour les dialogs
 * Structure exacte selon Figma : gradient subtil + cercle blanc avec bordure colorée
 */
export function DialogIcon({ type, config }: DialogIconProps) {
  // Configuration par défaut selon le type de dialog (selon Figma design tokens)
  const variantConfig: Record<
    DialogType,
    {
      icon: (typeof ICONS.dialogs)[keyof typeof ICONS.dialogs];
      borderColor: string; // Couleur de bordure cercle externe
      innerBorder: string; // Couleur de bordure cercle interne
      gradientFrom: string; // Couleur transparent (bas)
      gradientTo: string; // Couleur opaque (haut)
    }
  > = {
    success: {
      icon: ICONS.dialogs.checkSuccess,
      borderColor: "#b5e9d8",
      innerBorder: "#b5e9d8",
      gradientFrom: "rgba(181,233,216,0)",
      gradientTo: "#b5e9d8",
    },
    info: {
      icon: ICONS.dialogs.info,
      borderColor: "#bdb8f8",
      innerBorder: "#d3cffa",
      gradientFrom: "rgba(189,184,248,0)",
      gradientTo: "#bdb8f8",
    },
    warning: {
      icon: ICONS.dialogs.warningTriangle,
      borderColor: "#fcd34d",
      innerBorder: "#fef3c7",
      gradientFrom: "rgba(252,211,77,0)",
      gradientTo: "#fcd34d",
    },
    warningPrimary: {
      icon: ICONS.dialogs.warningTrianglePrimary,
      borderColor: "#bdb8f8",
      innerBorder: "#d3cffa",
      gradientFrom: "rgba(189,184,248,0)",
      gradientTo: "#bdb8f8",
    },
    danger: {
      icon: ICONS.dialogs.warningTriangle,
      borderColor: "#f8a9a9",
      innerBorder: "#fac5c5",
      gradientFrom: "rgba(248,169,169,0)",
      gradientTo: "#f8a9a9",
    },
    question: {
      icon: ICONS.dialogs.question,
      borderColor: "#bdb8f8",
      innerBorder: "#d3cffa",
      gradientFrom: "rgba(189,184,248,0)",
      gradientTo: "#bdb8f8",
    },
    confirm: {
      icon: ICONS.dialogs.question,
      borderColor: "#bdb8f8",
      innerBorder: "#d3cffa",
      gradientFrom: "rgba(189,184,248,0)",
      gradientTo: "#bdb8f8",
    },
    delete: {
      icon: ICONS.dialogs.trashDanger,
      borderColor: "#f8a9a9",
      innerBorder: "#fac5c5",
      gradientFrom: "rgba(248,169,169,0)",
      gradientTo: "#f8a9a9",
    },
  };

  const variant = variantConfig[type];

  // Si une icône personnalisée est fournie
  if (config?.customIcon) {
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
              <div className="relative h-6 w-6 shrink-0 overflow-clip">
                {config.customIcon}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sélectionner l'icône appropriée
  let iconToUse = variant.icon;

  // Si un type d'icône spécifique est demandé via config
  if (config?.type) {
    const iconMap: Record<
      string,
      (typeof ICONS.dialogs)[keyof typeof ICONS.dialogs]
    > = {
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

  return (
    <div
      className="relative shrink-0 rounded-full border border-solid"
      style={{
        borderColor: variant.borderColor,
        backgroundImage: `linear-gradient(to bottom, ${variant.gradientTo}, ${variant.gradientFrom} 100%)`,
      }}
    >
      {/* Cercle externe avec gradient subtil */}
      <div className="box-border flex items-start gap-4 overflow-clip rounded-[inherit] p-4">
        {/* Cercle du milieu blanc avec bordure colorée plus claire */}
        <div
          className="relative shrink-0 rounded-full border border-solid bg-white"
          style={{ borderColor: variant.innerBorder }}
        >
          {/* Padding et icône centrée */}
          <div className="box-border flex items-center justify-center gap-[14px] overflow-clip rounded-[inherit] p-[14px]">
            <div className="relative h-6 w-6 shrink-0 overflow-clip">
              <CustomIcon config={iconToUse} className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
