export const buttonVariants = {
  primary: {
    initial: { scale: 1, backgroundColor: "#3b82f6", color: "#ffffff" },
    hover: { scale: 1.05, backgroundColor: "#2563eb", color: "#ffffff" },
    tap: { scale: 0.95, backgroundColor: "#1d4ed8", color: "#ffffff" },
  },
  secondary: {
    initial: { scale: 1, backgroundColor: "#e5e7eb", color: "#111827" },
    hover: { scale: 1.05, backgroundColor: "#d1d5db", color: "#111827" },
    tap: { scale: 0.95, backgroundColor: "#9ca3af", color: "#111827" },
  },
};

export const buttonSimple = {
  initial: { scale: 1, ease: "anticipate" },
  hover: { scale: 1.05, ease: "anticipate" },
  tap: { scale: 0.95, ease: "anticipate" },
};
