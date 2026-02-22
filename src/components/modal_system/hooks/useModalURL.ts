"use client";

import { useModalStore } from "@/components/modal_system/store/useModal.store";
import type { ModalConfig } from "@/components/modal_system/types/modal.types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

/**
 * Hook pour synchroniser le modal avec l'URL
 * Permet de gérer l'état du modal via les query params
 *
 * Exemple d'URL:
 * /employees?modal=true&modalEntity=employee&modalId=123&modalMode=view&modalTab=profil
 */
export function useModalURL() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { config, isOpen, open, close } = useModalStore();

  /**
   * Ref pour tracker si on est en train de synchroniser (évite les race conditions)
   */
  const isSyncingRef = useRef(false);

  /**
   * Parse les paramètres URL pour reconstruire la config du modal
   */
  const parseURLParams = useCallback((): ModalConfig | null => {
    if (!searchParams) return null;

    const modalParam = searchParams.get("modal");
    const entity = searchParams.get("modalEntity");
    const entityId = searchParams.get("modalId");
    const mode = searchParams.get("modalMode");
    const activeTab = searchParams.get("modalTab");
    const size = searchParams.get("modalSize");

    if (modalParam !== "true") {
      return null;
    }

    // Récupérer tous les params additionnels (ceux qui commencent par "mp_")
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key.startsWith("mp_")) {
        params[key.replace("mp_", "")] = value;
      }
    });

    return {
      entity: entity as ModalConfig["entity"],
      entityId: entityId || undefined,
      mode: mode as ModalConfig["mode"],
      activeTab: activeTab || undefined,
      size: (size as ModalConfig["size"]) || "md",
      params: Object.keys(params).length > 0 ? params : undefined,
    };
  }, [searchParams]);

  /**
   * Construire l'URL avec les paramètres du modal
   */
  const buildURL = useCallback(
    (config: ModalConfig | null): string => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      const currentPath = pathname ?? "/";

      if (!config) {
        // Supprimer tous les params du modal
        params.delete("modal");
        params.delete("modalEntity");
        params.delete("modalId");
        params.delete("modalMode");
        params.delete("modalTab");
        params.delete("modalSize");

        // Supprimer les params additionnels
        Array.from(params.keys()).forEach((key) => {
          if (key.startsWith("mp_")) {
            params.delete(key);
          }
        });
      } else {
        params.set("modal", "true");
        if (config.entity) params.set("modalEntity", config.entity);
        if (config.entityId) params.set("modalId", config.entityId);
        if (config.mode) params.set("modalMode", config.mode);
        if (config.activeTab) params.set("modalTab", config.activeTab);
        if (config.size) params.set("modalSize", config.size);

        // Ajouter les params additionnels avec préfixe "mp_"
        if (config.params) {
          Object.entries(config.params).forEach(([key, value]) => {
            params.set(`mp_${key}`, String(value));
          });
        }
      }

      const queryString = params.toString();
      return queryString ? `${currentPath}?${queryString}` : currentPath;
    },
    [pathname, searchParams],
  );

  /**
   * Ouvrir le modal et mettre à jour l'URL
   */
  const openModal = useCallback(
    (modalConfig: ModalConfig) => {
      // Marquer qu'on est en train de synchroniser pour éviter les race conditions
      isSyncingRef.current = true;

      const newConfig = { ...modalConfig };
      if (!modalConfig.entityId && modalConfig.entity)
        newConfig.entityId = modalConfig.entity;
      open(newConfig);
      const url = buildURL(newConfig);
      router.push(url, { scroll: false });

      // Débloquer après un court délai pour laisser l'URL se synchroniser
      setTimeout(() => {
        isSyncingRef.current = false;
      }, 100);
    },
    [open, buildURL, router],
  );

  /**
   * Fermer le modal et nettoyer l'URL
   */
  const closeModal = useCallback(() => {
    // Marquer qu'on est en train de synchroniser pour éviter les race conditions
    isSyncingRef.current = true;

    close();
    const url = buildURL(null);
    router.push(url, { scroll: false });

    // Débloquer après un court délai pour laisser l'URL se synchroniser
    setTimeout(() => {
      isSyncingRef.current = false;
    }, 100);
  }, [close, buildURL, router]);

  /**
   * Changer l'onglet actif et mettre à jour l'URL
   */
  const setActiveTab = useCallback(
    (tabId: string) => {
      if (!config) return;

      const params = new URLSearchParams(searchParams?.toString() ?? "");
      const currentPath = pathname ?? "/";
      params.set("modalTab", tabId);
      router.push(`${currentPath}?${params.toString()}`, { scroll: false });

      useModalStore.getState().setActiveTab(tabId);
    },
    [config, pathname, searchParams, router],
  );

  /**
   * Synchroniser l'URL vers le store au montage et aux changements d'URL
   * Ne réagit QUE aux changements d'URL (ex: navigation back/forward)
   * Ignore les changements pendant la synchronisation pour éviter les glitches
   */
  const paramModal = searchParams?.get("modal");
  const paramEntity = searchParams?.get("modalEntity");
  const paramId = searchParams?.get("modalId");
  const paramMode = searchParams?.get("modalMode");
  const paramTab = searchParams?.get("modalTab");

  useEffect(() => {
    // Ignorer si on est en train de synchroniser (évite les race conditions)
    if (isSyncingRef.current) return;

    const urlConfig = parseURLParams();
    const currentState = useModalStore.getState();

    // Si l'URL demande d'ouvrir le modal et qu'il n'est pas ouvert
    if (urlConfig && !currentState.isOpen) {
      currentState.open(urlConfig);
    }
    // Si l'URL ne demande pas le modal mais qu'il est ouvert, on ferme
    else if (!urlConfig && currentState.isOpen) {
      currentState.close();
    }
  }, [
    // Ne réagir QU'AUX changements d'URL, pas aux changements de isOpen/config
    paramModal,
    paramEntity,
    paramId,
    paramMode,
    paramTab,
    parseURLParams,
  ]);

  return {
    isOpen,
    config,
    openModal,
    closeModal,
    setActiveTab,
    updateURL: (newConfig: ModalConfig) => {
      const url = buildURL(newConfig);
      router.push(url, { scroll: false });
    },
  };
}
