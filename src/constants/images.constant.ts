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
  },
} as const;

export type ImageKey = keyof typeof IMAGES;
export default IMAGES;