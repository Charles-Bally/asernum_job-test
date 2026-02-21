/**
 * 🎯 TyliPRO Modal System
 *
 * Système de modal géré entièrement par l'URL
 * Permet d'afficher des modals contextuels avec entités, tabs, et stacking
 * avec synchronisation bidirectionnelle URL ↔ État
 *
 * @example
 * ```tsx
 * import { useModal } from '@/modal_system'
 *
 * function MyComponent() {
 *   const modal = useModal()
 *
 *   const handleViewEmployee = () => {
 *     modal.view({
 *       entity: 'employee',
 *       entityId: '123',
 *       customContent: <EmployeeModal employee={data} />
 *     })
 *   }
 *
 *   return <button onClick={handleViewEmployee}>Voir détails</button>
 * }
 * ```
 */

// Types
export type {
  ModalButton,
  ModalConfig,
  ModalEntity,
  ModalLayout,
  ModalMode,
  ModalPosition,
  ModalProps,
  ModalProviderProps,
  ModalSize,
  ModalStep,
  ModalStore,
  ModalTab,
  ModalURLParams
} from "./types/modal.types";

// Hooks
export { useModal } from "./hooks/useModal";
export {
  getNestedValue,
  setNestedValue,
  useModalData
} from "./hooks/useModalData";
export {
  useModalEvent, useModalEventClear, useModalEventEmitter,
  useModalEventHistory, useModalEventOnce
} from "./hooks/useModalEvent";
export { useModalURL } from "./hooks/useModalURL";
export { useStepValidation } from "./hooks/useStepValidation";

// Store (rarement utilisé directement)
export { useModalStore } from "./store/useModal.store";

// Components
export { Modal } from "./components/Modal";
export { ModalContent } from "./components/ModalContent";
export { ModalFooter } from "./components/ModalFooter";
export { ModalHeader } from "./components/ModalHeader";
export { ModalProvider } from "./components/ModalProvider";
export { ModalSidebarStepper } from "./components/ModalSidebarStepper";
export { ModalStepper } from "./components/ModalStepper";
export { ModalWizardLayout } from "./components/ModalWizardLayout";

// Services
export {
  MODAL_EVENTS, modalEvents
} from "./services/modalEvents";
export type {
  ModalEventCallback,
  ModalEventSubscription,
  ModalEventType
} from "./services/modalEvents";
export {
  getModalComponent,
  registerModal,
  renderModalContent,
  useModalEntityData
} from "./services/modalRenderer";


