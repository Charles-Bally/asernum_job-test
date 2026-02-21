"use client";

import { IconConfig } from "@/constants/icons.constant";
import { cn } from "@/lib/utils";
import Image from "next/image";

type CustomIconProps = {
  config: IconConfig;
  className?: string;
  color?: string;
};
function CustomIcon({ config, className, color }: CustomIconProps) {
  const [width, height] = config.aspectRatio.split("/").map(Number);

  return (
    <Image
      src={config.src}
      alt={config.alt}
      width={width}
      height={height}
      style={{
        aspectRatio: config.aspectRatio,
        borderRadius: config.rounded ? "100%" : undefined,
        color: color,
      }}
      loading="lazy"
      className={cn(
        "shrink-0 object-contain select-none",
        config.className,
        className,
      )}
    />
  );
}

export default CustomIcon;
