"use client";

import { useEffect } from "react";
import { Modal } from "./Modal";
/**
 * Provider du modal à placer dans le layout racine
 * - Rend le composant Modal (portal)
 * - Enregistre les modals réutilisables
 * - La synchronisation URL est gérée par useModalURL
 */
export function ModalProvider() {
  useEffect(() => {
    // Enregistrer les modals au montage

  }, []);


  return <Modal />;
}
