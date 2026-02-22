"use client";

import IMAGES from "@/constants/images.constant";
import { motion } from "framer-motion";
import Image from "next/image";

function AuchanLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
    >
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Image
          src={IMAGES.logos.auchan.src}
          alt={IMAGES.logos.auchan.alt}
          width={240}
          height={80}
          priority
          className="max-w-[200px] w-full lg:max-w-[240px] select-none object-contain"
        />
      </motion.div>
    </motion.div>
  );
}

export default AuchanLoader;
