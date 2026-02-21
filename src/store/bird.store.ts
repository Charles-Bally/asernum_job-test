import type { EyeDirection } from "@/components/ui/render/AuchanBird";
import { create } from "zustand";

type BirdStore = {
  eyeDirection: EyeDirection;
  setEyeDirection: (direction: EyeDirection) => void;
};

export const useBirdStore = create<BirdStore>((set) => ({
  eyeDirection: "top-right",
  setEyeDirection: (direction) => set({ eyeDirection: direction }),
}));
