export const buttonVariants = {
  primary: {
    initial: { scale: 1, backgroundColor: "#e0001a", color: "#ffffff" },
    hover: { scale: 1.05, backgroundColor: "#c40017", color: "#ffffff" },
    tap: { scale: 0.95, backgroundColor: "#c40017", color: "#ffffff" },
  },
  secondary: {
    initial: { scale: 1, backgroundColor: "#f2f2f2", color: "#171717" },
    hover: { scale: 1.05, backgroundColor: "#e6e6e6", color: "#171717" },
    tap: { scale: 0.95, backgroundColor: "#d9d9d9", color: "#171717" },
  },
};

export const buttonSimple = {
  initial: { scale: 1, ease: "anticipate" },
  hover: { scale: 1.05, ease: "anticipate" },
  tap: { scale: 0.95, ease: "anticipate" },
};
