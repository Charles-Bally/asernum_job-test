"use client";

import { dialog } from "@/components/dialog_system";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { ModalInstanceProvider } from "../context/ModalInstanceContext";
import { useModal } from "../hooks/useModal";
import {
  renderModalContent,
  useModalEntityData,
} from "../services/modalRenderer";
import { useModalStore } from "../store/useModal.store";
import type { ModalConfig } from "../types/modal.types";

/**
 * Conteneur principal du modal avec Framer Motion
 * - Portal pour overlay et modal centré
 * - Animations fluides avec Framer Motion
 * - Support du stacking (plusieurs modals empilés)
 * - z-index incrémenté pour chaque niveau de stack
 * - Options de fermeture avancées (confirmation, blocage ESC, etc.)
 */

/**
 * Composant qui gère le contenu d'un modal avec ses propres hooks
 */
function ModalContent({ config }: { config: ModalConfig | null }) {
  const { data, loading } = useModalEntityData(config);

  if (!config) {
    return (
      <div className="flex h-full items-center justify-center text-slate-500">
        Aucune configuration
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <div className="border-t-auchan-red h-8 w-8 animate-spin rounded-full border-4 border-slate-200" />
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  return <>{renderModalContent(config, data || undefined)}</>;
}

export function Modal() {
  // ✅ Utiliser des sélecteurs pour créer des souscriptions réactives
  const isOpen = useModalStore((state) => state.isOpen);
  const config = useModalStore((state) => state.config);
  const stack = useModalStore((state) => state.stack);
  const pop = useModalStore((state) => state.pop);

  const modal = useModal();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [exitingConfig, setExitingConfig] = useState<ModalConfig | null>(null);

  const stackLevel = stack.length;
  const totalModals = isOpen ? stackLevel + 1 : 0;

  // Mise à jour pendant le render (pattern React recommandé)
  if (config && exitingConfig !== config) {
    setExitingConfig(config);
  }

  useEffect(() => {
    if (!isOpen && !config) {
      const timer = setTimeout(() => {
        setExitingConfig(null);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [config, isOpen]);

  const handleClose = useCallback(async () => {
    const configToUse = config || exitingConfig;
    if (!configToUse) return;

    if (configToUse.preventClose) {
      return;
    }

    if (configToUse.onBeforeClose) {
      const canClose = await configToUse.onBeforeClose();
      if (!canClose) return;
    }

    if (configToUse.confirmOnClose) {
      const result = await dialog({
        type: "warning",
        title: configToUse.confirmCloseTitle || "Confirmer la fermeture ?",
        message:
          configToUse.confirmCloseMessage ||
          "Êtes-vous sûr de vouloir fermer ? Les modifications non sauvegardées seront perdues.",
        buttons: [
          { label: "Annuler", action: "cancel", variant: "outline" },
          { label: "Fermer", action: "confirm", variant: "danger" },
        ],
      });

      if (result.action !== "confirm") return;
    }

    const previousConfig = configToUse;
    const previousStackLength = stackLevel;

    if (configToUse.onClose) {
      configToUse.onClose();

      const {
        config: currentConfig,
        stack: currentStack,
        isOpen: currentIsOpen,
      } = useModalStore.getState();

      const hasHandledClosure =
        !currentIsOpen ||
        currentConfig !== previousConfig ||
        currentStack.length < previousStackLength;

      if (hasHandledClosure) {
        return;
      }
    }

    if (stackLevel > 0) {
      pop();
    } else {
      modal.close();
    }
  }, [config, exitingConfig, stackLevel, pop, modal]);

  useEffect(() => {
    const configToUse = config || exitingConfig;
    if (!isOpen || !configToUse) return;

    if (configToUse.closeOnEsc === false || configToUse.preventClose) return;

    const handleEscape = async (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        await handleClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, config, exitingConfig, handleClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || (!isOpen && stack.length === 0 && !exitingConfig))
    return null;

  const activeConfig = config || exitingConfig;

  // Créer un tableau complet de tous les modals (pile + actif)
  // pour que React les garde dans le même arbre DOM
  const allModals = [...stack, activeConfig].filter(Boolean) as ModalConfig[];

  const renderModalPanel = (
    modalConfig: ModalConfig | null,
    level: number,
    isActive: boolean,
  ) => {
    if (!modalConfig) return null;

    const keepMounted = modalConfig.keepMountedWhenStacked ?? true;

    const zIndex = 20 + level + 1;
    const scale = isActive ? 1 : 0.95 - level * 0.02;

    // Clé stable basée sur l'ID unique du modal (généré au push/open)
    // L'ID est généré une seule fois et reste stable même si le level change
    const panelKey =
      modalConfig.id ||
      `modal-${modalConfig.entity}-${modalConfig.entityId || "new"}`;

    const sizeClasses = {
      sm: "448px",
      md: "672px",
      lg: "896px",
      xl: "1152px",
      full: "95vw",
    };

    const positionClasses = {
      center: "items-center",
      top: "items-start pt-20",
      bottom: "items-end pb-20",
    };

    const providerValue = {
      id: modalConfig.id || panelKey,
      config: modalConfig,
      level,
      isActive,
    } as const;

    return (
      <ModalInstanceProvider key={panelKey} value={providerValue}>
        <motion.div
          className={cn(
            "pointer-events-none absolute inset-0 flex justify-center",
            positionClasses[modalConfig.position || "center"],
          )}
          style={{ zIndex }}
          initial={false}
          animate={{
            opacity: isActive ? 1 : 0.7,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
        >
          <motion.div

            className={cn(
              "pointer-events-auto relative w-full max-w-[calc(100vw-2rem)] rounded-2xl bg-white shadow-2xl",
              sizeClasses[modalConfig.size || "md"],
              modalConfig.className,
            )}
            style={{
              maxHeight: "95dvh",
              width: sizeClasses[modalConfig.size || "md"],
              maxWidth: "95dvw",
            }}
            initial={{
              scale: 0.9,
              opacity: 0,
            }}
            animate={{
              scale: isOpen ? scale : 0.9,
              opacity: isOpen ? 1 : 0,
            }}
            exit={{
              scale: 0.9,
              opacity: 0,
            }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.3,
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            {totalModals > 1 && isActive && false && (
              <div className="bg-auchan-red/10 text-auchan-red-hover absolute top-4 right-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold">
                <span>
                  {totalModals} modal{totalModals > 1 ? "s" : ""}
                </span>
                <div className="flex gap-0.5">
                  {Array.from({ length: totalModals }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        i === totalModals - 1
                          ? "bg-auchan-red-hover"
                          : "bg-auchan-red-muted",
                      )}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Rendre le contenu mais le cacher si pas actif pour préserver l'état */}
            {keepMounted ? (
              <div className={cn("h-full", !isActive && "opacity-100")}>
                <ModalContent config={modalConfig} />
              </div>
            ) : (
              isActive && (
                <div className="h-full">
                  <ModalContent config={modalConfig} />
                </div>
              )
            )}
          </motion.div>
        </motion.div>
      </ModalInstanceProvider>
    );
  };

  return createPortal(
    <AnimatePresence mode="wait">
      {(isOpen || stack.length > 0) && (
        <motion.div
          key="modal-container"
          className="fixed inset-0"
          style={{ zIndex: 150 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.div
            key="modal-overlay"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={async () => {
              const configToUse = config || exitingConfig;
              if (
                configToUse?.closeOnOverlayClick === false ||
                configToUse?.preventClose
              ) {
                return;
              }

              await handleClose();
            }}
            aria-label="Fermer le modal"
          />

          <AnimatePresence>
            {allModals.map((modalConfig, index) => {
              const isActive = index === allModals.length - 1;
              return renderModalPanel(modalConfig, index, isActive);
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
