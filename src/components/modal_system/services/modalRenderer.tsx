"use client";

import { useEffect, useReducer } from "react";
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
type EntityState = { data: any; loading: boolean };
type EntityAction =
  | { type: "start" }
  | { type: "done"; data: any }
  | { type: "reset" };

function entityReducer(_state: EntityState, action: EntityAction): EntityState {
  switch (action.type) {
    case "start":
      return { data: null, loading: true };
    case "done":
      return { data: action.data, loading: false };
    case "reset":
      return { data: null, loading: false };
  }
}

export function useModalEntityData(config: ModalConfig | null) {
  const entity = config?.entity;
  const entityId = config?.entityId;

  const [state, dispatch] = useReducer(entityReducer, { data: null, loading: false });

  useEffect(() => {
    if (!entity || !entityId) {
      return;
    }

    dispatch({ type: "start" });

    // Simulation de chargement — à remplacer par un vrai appel API
    const timer = setTimeout(() => {
      dispatch({ type: "done", data: null });
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [entity, entityId]);

  return { data: state.data, loading: state.loading };
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
