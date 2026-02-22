"use client";

import { buttonSimple } from "@/animations/button.settings";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import React from "react";

export type CustomButtonProps = {
  children: React.ReactNode;
  id?: string;
  style?: React.CSSProperties;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "none";
  size?: "sm" | "md" | "lg" | "none";
  icon?: {
    render: React.ReactNode;
    position: "left" | "right";
  };
  className?: string;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
  animation?: boolean;
};

const variantStyles = {
  primary:
    "bg-auchan-red text-white hover:bg-auchan-red-hover focus:ring-auchan-red",
  secondary:
    "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 focus:ring-neutral-500",
  outline:
    "border border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus:ring-auchan-red",
  ghost: "text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500",
  danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
  none: "ring-0 p-0 bg-none outline-none border-0 focus:ring-0 focus:ring-offset-0",
};

const sizeStyles = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-[14px] text-sm",
  lg: "px-6 py-4 text-md",
  none: "",
};

function CustomButton({
  children,
  id,
  onClick,
  disabled,
  style,
  loading,
  variant = "none",
  size = "none",
  icon,
  className,
  type = "button",
  ariaLabel,
  animation = true,
}: CustomButtonProps) {
  const isDisabled = disabled || loading;



  return (
    <motion.button
      id={id}
      initial={animation ? buttonSimple.initial : undefined}
      whileHover={animation ? buttonSimple.hover : undefined}
      whileTap={animation ? buttonSimple.tap : undefined}
      type={type}
      style={style}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center rounded-[10px] font-medium transition-all duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {icon && icon.position === "left" && !loading && (
        <span className="mr-2 flex items-center">{icon.render}</span>
      )}
      {children}
      {icon && icon.position === "right" && (
        <span className="ml-2 flex items-center">{icon.render}</span>
      )}
    </motion.button>
  );
}

export default CustomButton;
