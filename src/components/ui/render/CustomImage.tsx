"use client";

import { ImageConfig } from "@/constants/images.constant";
import { cn } from "@/lib/utils";
import Image from "next/image";

type CustomImageProps = {
  config: ImageConfig;
};
function CustomImage({ config }: CustomImageProps) {
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
      }}
      loading="lazy"
      className={cn("shrink-0 object-contain", config.className)}
    />
  );
}

export default CustomImage;
