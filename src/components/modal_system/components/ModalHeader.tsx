"use client";

import CustomButton from "@/components/ui/render/CustomButton";
import CustomIcon from "@/components/ui/render/CustomIcon";
import ICONS from "@/constants/icons.constant";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useModal } from "../hooks/useModal";
import type { ModalConfig } from "../types/modal.types";

interface ModalHeaderProps {
  /** Configuration du modal (mode intégré) */
  config?: ModalConfig;
  /** Titre principal du modal */
  title?: string;
  /** Sous-titre ou description */
  subtitle?: string;
  /** Icône à afficher à gauche du titre */
  icon?: {
    config: any;
    className?: string;
    bgColor?: string;
  };
  /** Avatar/Image à afficher (URL) */
  avatar?: string;
  /** Badges/tags à afficher */
  badges?: Array<{
    icon?: React.ReactNode;
    label: string;
    variant?: "default" | "success" | "warning" | "danger" | "info";
  }>;
  /** Afficher le bouton de fermeture */
  showCloseButton?: boolean;
  /** Empêcher la fermeture */
  preventClose?: boolean;
  /** Callback de fermeture personnalisé */
  onClose?: () => void;
  /** Contenu personnalisé pour le header (remplace tout) */
  customContent?: React.ReactNode;
  /** Contenu additionnel à droite (avant le bouton close) */
  rightContent?: React.ReactNode;
  /** Classe CSS personnalisée */
  className?: string;
  /** Variante du header */
  variant?: "default" | "compact" | "large";
}

/**
 * Header réutilisable pour les modals
 * Design Figma : Header avec titre, sous-titre, icône/avatar, badges, bouton fermeture
 *
 * @example
 * ```tsx
 * // Simple
 * <ModalHeader
 *   title="Nouvel employé"
 *   subtitle="Créer un nouveau profil"
 * />
 *
 * // Avec config
 * <ModalHeader config={modalConfig} onClose={handleClose} />
 * ```
 */
export function ModalHeader({
  config,
  title: titleProp,
  subtitle: subtitleProp,
  icon: iconProp,
  avatar: avatarProp,
  badges: badgesProp,
  showCloseButton: showCloseButtonProp = true,
  preventClose: preventCloseProp = false,
  onClose: onCloseProp,
  customContent,
  rightContent,
  className,
  variant: _variant = "default",
}: ModalHeaderProps) {
  const modal = useModal();

  // Extraire les valeurs soit de config soit des props directes
  const title = config?.title || titleProp;
  const subtitle = config?.subtitle || subtitleProp;
  const showCloseButton = config?.showCloseButton ?? showCloseButtonProp;
  const preventClose = config?.preventClose ?? preventCloseProp;

  // Les props optionnelles
  const icon = iconProp;
  const avatar = avatarProp;
  const badges = badgesProp || [];

  const handleClose = () => {
    if (preventClose) return;
    if (onCloseProp) {
      onCloseProp();
    } else {
      modal.close();
    }
  };

  // Si customContent est fourni, afficher uniquement ça
  if (customContent) {
    return (
      <div className={cn("border-b border-slate-100 px-6 py-4", className)}>
        {customContent}
      </div>
    );
  }

  const badgeVariants = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <div
      className={cn(
        // Design Figma exact: h-[88px] + px-[24px] + border-bottom
        "flex h-[72px] sm:h-[88px] shrink-0 items-center justify-between border-b border-slate-100 sm:px-6 px-4",
        className,
      )}
    >
      {/* Ligne principale : Icon/Avatar + Titre + Actions */}
      <div className="flex flex-1 items-center justify-between gap-4">
        {/* Zone gauche : Icon/Avatar + Titre + Subtitle */}
        <div className="flex flex-1 items-center gap-3">
          {/* Icon ou Avatar */}
          {icon && !avatar && (
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                icon.bgColor || "bg-purple-100",
              )}
            >
              <CustomIcon
                config={icon.config}
                className={cn("h-5 w-5", icon.className || "text-auchan-red-hover")}
              />
            </div>
          )}

          {avatar && (
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm">
              <Image
                src={avatar}
                alt={"Avatar"}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          )}

          {/* Titre + Subtitle */}
          <div className="flex flex-1 flex-col">
            {title && (
              <h2
                id="modal-title"
                className="text-[18px] leading-[22px] font-semibold text-slate-900"
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm font-normal text-slate-600">{subtitle}</p>
            )}

            {/* Badges */}
            {badges.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {badges.map((badge, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium",
                      badgeVariants[badge.variant || "default"],
                    )}
                  >
                    {badge.icon}
                    <span>{badge.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Zone droite : Contenu custom + Bouton fermeture */}
        <div className="flex shrink-0 items-center gap-2">
          {rightContent}

          {showCloseButton && !preventClose && (
            <CustomButton
              onClick={handleClose}
              className={cn(
                "flex sm:h-10 h-9 sm:w-10 w-9 items-center justify-center rounded-lg border border-slate-100 bg-white p-2 transition-colors hover:bg-slate-50",
              )}
              aria-label="Fermer"
            >
              <CustomIcon config={ICONS.actions.mark} className="sm:size-8 size-7" />
            </CustomButton>
          )}
        </div>
      </div>
    </div>
  );
}
