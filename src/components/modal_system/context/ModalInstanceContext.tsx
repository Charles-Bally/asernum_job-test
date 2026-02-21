"use client";

import { createContext, useContext } from "react";
import type { ModalConfig } from "../types/modal.types";

interface ModalInstanceContextValue {
  id: string;
  config: ModalConfig;
  level: number;
  isActive: boolean;
}

interface ModalInstanceProviderProps {
  value: ModalInstanceContextValue;
  children: React.ReactNode;
}

const ModalInstanceContext = createContext<ModalInstanceContextValue | null>(
  null,
);

export function ModalInstanceProvider({
  value,
  children,
}: ModalInstanceProviderProps) {
  return (
    <ModalInstanceContext.Provider value={value}>
      {children}
    </ModalInstanceContext.Provider>
  );
}

export function useModalInstance() {
  return useContext(ModalInstanceContext);
}

export { ModalInstanceContext };
