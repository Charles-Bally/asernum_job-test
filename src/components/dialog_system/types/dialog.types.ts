import React from "react";

export type DialogAction = string | "confirm" | "cancel" | "close";

export type DialogType =
  | "info"
  | "success"
  | "warning"
  | "warningPrimary"
  | "danger"
  | "question"
  | "confirm"
  | "delete";

export type DialogButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export interface DialogButton {
  label: string;
  action?: DialogAction;
  variant?: DialogButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  autoFocus?: boolean;
}

export interface DialogIconConfig {
  type?: "user" | "userPrimary" | "trash" | "trashDanger" | "trashSuccess" | "warning" | "warningPrimary" | "check" | "lock" | "lockPrimary" | "info" | "question";
  color?: string;
  customIcon?: React.ReactNode;
}

export interface DialogOptions {
  type?: DialogType;
  title?: string;
  message?: React.ReactNode;
  description?: string;
  icon?: DialogIconConfig;
  buttons?: DialogButton[];
  closeable?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  width?: number;
  className?: string;
  contentClassName?: string;
  autoClose?: number;
  onOpen?: () => void;
  onClose?: () => void;
}

// Constants pour les types de dialog
export const DIALOG_TYPES = {
  INFO: "info" as const,
  SUCCESS: "success" as const,
  WARNING: "warning" as const,
  DANGER: "danger" as const,
  ERROR: "danger" as const, // alias
  QUESTION: "question" as const,
  CONFIRM: "confirm" as const,
  DELETE: "delete" as const,
};

export interface DialogResult<T = DialogAction> {
  action: T;
  button?: DialogButton;
}

export interface DialogPromise<T = DialogAction>
  extends Promise<DialogResult<T>> {
  close: (action?: T) => void;
}

export interface DialogStore {
  dialogs: Map<
    string,
    DialogOptions & {
      resolve: (result: DialogResult) => void;
      reject: (reason?: any) => void;
    }
  >;
  show: <T = DialogAction>(options: DialogOptions) => DialogPromise<T>;
  close: (id: string, action?: DialogAction) => void;
  closeAll: () => void;
}
