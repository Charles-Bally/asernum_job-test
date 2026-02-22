"use client";

import { useEffect } from "react";
import { CreateUserModal } from "../entities/CreateUserModal";
import { registerModal } from "../services/modalRenderer";
import { Modal } from "./Modal";
/**
 * Provider du modal à placer dans le layout racine
 * - Rend le composant Modal (portal)
 * - Enregistre les modals réutilisables
 * - La synchronisation URL est gérée par useModalURL
 */

registerModal("create-user", CreateUserModal);

export function ModalProvider() {
  useEffect(() => {
    // Enregistrer les modals au montage

  }, []);


  return <Modal />;
}
