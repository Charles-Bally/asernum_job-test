"use client";

import { useEffect, useState } from "react";
import type { ModalConfig } from "../types/modal.types";

/**
 * Service pour rendre le contenu d'un modal en fonction de sa configuration
 * Gère automatiquement le rendu des modals enregistrés ou du contenu custom
 */

// Registry des modals enregistrés
const modalRegistry = new Map<
  string,
  React.ComponentType<{ config: ModalConfig; data?: any }>
>();

/**
 * Enregistrer un modal pour une entité donnée
 * À utiliser dans ModalProvider pour enregistrer vos modals
 */
export function registerModal(
  entity: string,
  component: React.ComponentType<{ config: ModalConfig; data?: any }>,
) {
  modalRegistry.set(entity, component);
}

/**
 * Obtenir le composant modal pour une entité
 */
export function getModalComponent(entity: string) {
  return modalRegistry.get(entity);
}

/**
 * Hook pour charger les données d'une entité
 * À personnaliser selon vos besoins
 */
export function useModalEntityData(config: ModalConfig | null) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!config?.entity || !config.entityId) {
      setData(null);
      return;
    }

    // Ici, vous pouvez implémenter la logique de chargement
    // Par exemple, appeler une API pour récupérer les données de l'entité
    setLoading(true);

    // Simulation de chargement
    const timer = setTimeout(() => {
      setData(null); // Les données seront passées via customContent
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [config?.entity, config?.entityId]);

  return { data, loading };
}

/**
 * Rendre le contenu d'un modal
 * - Si customContent existe, l'utiliser
 * - Sinon, chercher un modal enregistré pour l'entité
 * - Sinon, afficher un message par défaut
 */
export function renderModalContent(
  config: ModalConfig,
  data?: any,
): React.ReactNode {
  // 1. Si customContent est fourni, l'utiliser
  if (config.customContent) {
    return config.customContent;
  }

  // 2. Si content est fourni, l'utiliser
  if (config.content) {
    return config.content;
  }

  // 3. Chercher un modal enregistré pour cette entité
  if (config.entity) {
    const ModalComponent = getModalComponent(config.entity);
    if (ModalComponent) {
      return <ModalComponent config={config} data={data} />;
    }
  }

  // 4. Fallback : message par défaut
  return (
    <div className="flex h-full items-center justify-center p-8 text-slate-500">
      <div className="text-center">
        <p className="mb-2 text-lg font-semibold">Modal non configuré</p>
        <p className="text-sm">
          Aucun contenu défini pour{" "}
          {config.entity ? `l'entité "${config.entity}"` : "ce modal"}
        </p>
      </div>
    </div>
  );
}
