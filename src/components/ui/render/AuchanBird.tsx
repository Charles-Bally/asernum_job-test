"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

export type EyeDirection =
  | "center"
  | "left"
  | "right"
  | "up"
  | "down"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

type AuchanBirdProps = {
  eyeDirection?: EyeDirection;
  opacity?: number;
  className?: string;
};

// Pupil position as [x%, y%] of available range (0-100)
// Eye: 41x41, Pupil: 16x16, Range: 25x25
const PUPIL_POSITIONS: Record<EyeDirection, [number, number]> = {
  "center": [50, 50],
  "left": [10, 50],
  "right": [90, 50],
  "up": [50, 10],
  "down": [50, 90],
  "top-left": [10, 10],
  "top-right": [80, 16],
  "bottom-left": [16, 72],
  "bottom-right": [80, 72],
};

// Eye position relative to bird body (442 x 357.096)
// Red circle (41x41) at (329, 29)
const EYE = {
  left: `${(329 / 442) * 100}%`,
  top: `${(29 / 357.096) * 100}%`,
  width: `${(41 / 442) * 100}%`,
  height: `${(41 / 357.096) * 100}%`,
};

// Max pupil offset as % of eye size: (41 - 16) / 41
const MAX_OFFSET = (25 / 41) * 100;

function AuchanBird({ eyeDirection = "center", opacity, className }: AuchanBirdProps) {
  const [px, py] = PUPIL_POSITIONS[eyeDirection];

  return (
    <div
      className={cn("relative", className)}
      style={{ aspectRatio: "442 / 357", opacity }}
    >
      <Image
        src="/images/auth/bird-body.svg"
        alt="Oiseau Auchan"
        fill
        className="pointer-events-none select-none object-contain"
        unoptimized
      />

      {/* Eye — red circle */}
      <div
        className="absolute overflow-hidden rounded-full bg-auchan-red"
        style={{
          left: EYE.left,
          top: EYE.top,
          width: EYE.width,
          height: EYE.height,
        }}
      >
        {/* Pupil — white circle, animated */}
        <motion.div
          className="absolute size-[39%] rounded-full bg-white"
          animate={{
            left: `${(px / 100) * MAX_OFFSET}%`,
            top: `${(py / 100) * MAX_OFFSET}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        />
      </div>
    </div>
  );
}

export default AuchanBird;
