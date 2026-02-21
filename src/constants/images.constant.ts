export type ImageConfig = {
  src: string;
  alt: string;
  aspectRatio: string;
  rounded?: boolean;
  className?: string;
};

const IMAGES = {
  logos: {
    logo: {
      src: "/images/logos/logo.svg",
      alt: "Logo",
      aspectRatio: "12/12",
    },
    auchan: {
      src: "/icons/logos/auchan.png",
      alt: "Auchan",
      aspectRatio: "120/40",
    },
  },
  auth: {
    bird: {
      src: "/images/auth/bird.png",
      alt: "Oiseau décoratif",
      aspectRatio: "1436/1330",
    },
  },
} as const;

export type ImageKey = keyof typeof IMAGES;
export default IMAGES;