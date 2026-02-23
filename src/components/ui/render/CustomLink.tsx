"use client";

import { buttonSimple } from "@/animations/button.settings";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

export type CustomLinkProps = {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "none";
  size?: "sm" | "md" | "lg" | "none";
  containerClassName?: string;
  icon?: {
    render: React.ReactNode;
    position: "left" | "right";
  };
  className?: string;
  ariaLabel?: string;
  animation?: boolean;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
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

function CustomLink({
  children,
  href,
  variant = "none",
  size = "md",
  icon,
  containerClassName,
  className,
  ariaLabel,
  animation = true,
  target = "_self",
  rel,
  onClick,
}: CustomLinkProps) {
  return (
    <motion.div
      initial={animation ? buttonSimple.initial : undefined}
      whileHover={animation ? buttonSimple.hover : undefined}
      whileTap={animation ? buttonSimple.tap : undefined}
      className={cn("inline-block", containerClassName)}
    >
      <Link
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        aria-label={ariaLabel}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center rounded-[10px] font-medium transition-all duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none",
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
      >
        {icon && icon.position === "left" && (
          <span className="mr-2 flex items-center">{icon.render}</span>
        )}
        {children}
        {icon && icon.position === "right" && (
          <span className="ml-2 flex items-center">{icon.render}</span>
        )}
      </Link>
    </motion.div>
  );
}

export default CustomLink;
