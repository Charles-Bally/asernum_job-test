"use client";

import { Suspense } from "react";
import { ChangePasswordModal } from "../entities/ChangePasswordModal";
import { CreateStoreModal } from "../entities/CreateStoreModal";
import { CreateUserModal } from "../entities/CreateUserModal";
import { registerModal } from "../services/modalRenderer";
import { Modal } from "./Modal";

registerModal("create-user", CreateUserModal);
registerModal("change-password", ChangePasswordModal);
registerModal("add-store", CreateStoreModal);

export function ModalProvider() {
  return (
    <Suspense fallback={null}>
      <Modal />
    </Suspense>
  );
}
