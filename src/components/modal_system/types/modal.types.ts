/**
 * Types pour le système de modal géré par URL
 * Permet d'afficher des modals contextuels avec entités, tabs, et paramètres customs
 */

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export type ModalPosition = "center" | "top" | "bottom";

export type ModalLayout = "default" | "wizard";

export type ModalMode =
    | "view"
    | "edit"
    | "create"
    | "delete"
    | "details"
    | "settings";

export type ModalEntity =
    | "add-store"

export interface ModalTab {
    id: string;
    label: string;
    icon?: React.ReactNode;
    component?: React.ReactNode;
    disabled?: boolean;
}

export interface ModalStep {
    id: string;
    label?: string;
    title?: string;
    size?: ModalSize;
    component?: React.ReactNode;
    validate?: () => boolean | Promise<boolean>;
    onNext?: () => void | Promise<void>;
    onBack?: () => void | Promise<void>;
}

export interface ModalButton {
    label: string;
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    action?: "next" | "back" | "cancel" | "submit" | "custom";
    onClick?: () => void | Promise<void>;
    disabled?: boolean;
    loading?: boolean;
    hidden?: boolean;
}

export interface ModalConfig {
    // Identification
    id?: string;
    customId?: string; // 🆕 ID custom fourni par l'utilisateur (prioritaire pour identification)
    entity?: ModalEntity;
    entityId?: string;
    mode?: ModalMode;

    // 🆕 Hiérarchie et relations
    parentId?: string; // ID du modal parent dans la stack
    children?: string[]; // IDs des modals enfants

    // UI Configuration
    title?: React.ReactNode;
    subtitle?: string;
    size?: ModalSize;
    width?: string; // Custom width (pour les exemples)
    height?: string; // Custom height (pour les exemples)
    position?: ModalPosition;
    showOverlay?: boolean;
    closeOnOverlayClick?: boolean;
    closeOnEsc?: boolean;
    showCloseButton?: boolean;

    // Options de fermeture avancées
    confirmOnClose?: boolean;
    confirmCloseMessage?: string;
    confirmCloseTitle?: string;
    preventClose?: boolean;
    onBeforeClose?: () => boolean | Promise<boolean>;

    // Options de stacking
    /** Si true (défaut), le modal reste monté et visible en arrière-plan lors d'un push.
     * Si false, le modal est complètement démonté et son état n'est pas préservé. */
    keepMountedWhenStacked?: boolean;

    // Tabs (comme sidebar)
    tabs?: ModalTab[];
    activeTab?: string;

    // Stepper (pour les wizards multi-étapes)
    steps?: ModalStep[];
    currentStep?: number;
    showStepper?: boolean;
    showStepperLabels?: boolean;
    stepsValidation?: Record<string, boolean>; // État de validation par stepId

    // Layout
    layout?: ModalLayout;

    // Content
    content?: React.ReactNode;
    customContent?: React.ReactNode;
    headerContent?: React.ReactNode;
    footerContent?: React.ReactNode;
    customFooterClassName?: string;
    footerTopContent?: React.ReactNode;
    customFooter?: boolean;

    // Buttons
    buttons?: ModalButton[];
    showCancelButton?: boolean;
    showBackButton?: boolean;
    showNextButton?: boolean;
    cancelLabel?: string;
    cancelClassName?: string;
    backLabel?: string;
    nextLabel?: string;
    submitLabel?: string;
    submitIcon?: React.ReactNode;
    submitClassName?: string;
    submitDisabled?: boolean;

    // Save for later
    showSaveForLater?: boolean;
    saveForLaterLabel?: string;
    saveForLaterFromStep?: number; // À partir de quelle étape afficher (défaut: 1)
    onSaveForLater?: () => void | Promise<void>;

    // Validation & Actions
    onBeforeNext?: (currentStep: number) => boolean | Promise<boolean>;
    onBeforeBack?: (currentStep: number) => boolean | Promise<boolean>;
    onComplete?: (data?: any) => void | Promise<void>;
    onCancel?: () => void;
    onClose?: () => void;
    onSave?: () => void | Promise<void>;
    onDelete?: () => void | Promise<void>;

    // Options avancées
    className?: string;
    overlayClassName?: string;
    contentClassName?: string;

    // Additional params (comme sidebar)
    params?: Record<string, string | number | boolean | object>;

    // Data
    data?: Record<string, any>;
    customData?: Record<string, any>;
}

export interface ModalURLParams {
    modal?: string;
    modalEntity?: ModalEntity;
    modalId?: string;
    modalMode?: ModalMode;
    modalTab?: string;
    modalSize?: string;

    [key: string]: string | undefined;
}

export interface ModalStore {
    config: ModalConfig | null;
    isOpen: boolean;
    stack: ModalConfig[];
    open: (config: ModalConfig) => void;
    close: () => void;
    setActiveTab: (tabId: string, modalId?: string) => void;
    push: (config: ModalConfig) => void;
    pop: () => void;
    closeAll: () => void;
    getStackCount: () => number;
    goToStep: (stepIndex: number, modalId?: string) => void;
    nextStep: (modalId?: string) => Promise<void>;
    prevStep: (modalId?: string) => void;
    updateConfig: (config: Partial<ModalConfig>, modalId?: string) => void;
    updateData: (data: Record<string, any>, modalId?: string) => void;
    getModalById: (modalId: string) => ModalConfig | null;

    // Validation des steps
    setStepValidated: (stepId: string, validated: boolean, modalId?: string) => void;
    isStepAccessible: (stepIndex: number, modalId?: string) => boolean;

    // 🆕 Helpers de navigation cross-modal
    getParentModal: (modalId: string) => ModalConfig | null;
    getAllParents: (modalId: string) => ModalConfig[];
    getChildren: (modalId: string) => ModalConfig[];
    getStackPosition: (modalId: string) => number | null;
    getAllModals: () => ModalConfig[];
}

export interface ModalProviderProps {
    children?: React.ReactNode;
}

export interface ModalProps {
    config: ModalConfig;
    onClose: () => void;
}
