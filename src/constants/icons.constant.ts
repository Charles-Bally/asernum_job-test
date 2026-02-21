export type IconConfig = {
  src: string;
  activated?: string;
  alt: string;
  aspectRatio: string;
  rounded?: boolean;
  className?: string;
};
const ICONS = {
  actions: {
    mark: {
      src: "/icons/actions/mark.svg",
      alt: "Cross",
      aspectRatio: "24/24",
    },
  },
  dialogs: {
    userSuccess: {
      src: "/icons/dialogs/user-success.svg",
      alt: "Succès utilisateur",
      aspectRatio: "24/24",
    },
    userPrimary: {
      src: "/icons/dialogs/user-primary.svg",
      alt: "Utilisateur",
      aspectRatio: "24/24",
    },
    trashDelete: {
      src: "/icons/dialogs/trash-delete.svg",
      alt: "Supprimer",
      aspectRatio: "24/24",
    },
    trashDanger: {
      src: "/icons/dialogs/trash-danger.svg",
      alt: "Supprimer danger",
      aspectRatio: "24/24",
    },
    trashSuccess: {
      src: "/icons/dialogs/trash-success.svg",
      alt: "Suppression réussie",
      aspectRatio: "24/24",
    },
    lockWarning: {
      src: "/icons/dialogs/lock-warning.svg",
      alt: "Avertissement cadenas",
      aspectRatio: "24/24",
    },
    lockPrimary: {
      src: "/icons/dialogs/lock-primary.svg",
      alt: "Cadenas",
      aspectRatio: "24/24",
    },
    info: {
      src: "/icons/dialogs/info.svg",
      alt: "Information",
      aspectRatio: "24/24",
    },
    checkSuccess: {
      src: "/icons/dialogs/check-success.svg",
      alt: "Succès",
      aspectRatio: "24/24",
    },
    warningTrianglePrimary: {
      src: "/icons/dialogs/warning-triangle-primary.svg",
      alt: "Avertissement",
      aspectRatio: "24/24",
    },
    warningTriangle: {
      src: "/icons/dialogs/warning-triangle.svg",
      alt: "Avertissement",
      aspectRatio: "24/24",
    },
    question: {
      src: "/icons/dialogs/question.svg",
      alt: "Question",
      aspectRatio: "24/24",
    },
  },
} as const;

export type IconKey = keyof typeof ICONS;
export default ICONS;
