"use client";

import AuchanBird from "@/components/ui/render/AuchanBird";
import { useBirdStore } from "@/store/bird.store";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const eyeDirection = useBirdStore((s) => s.eyeDirection);

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-auchan-red">
      <AuchanBird
        eyeDirection={eyeDirection}
        opacity={0.3}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/9 w-[calc(100%-70px)] pointer-events-none"
      />

      <div className="relative z-10">
        {/* Shadow card */}
        <div className="absolute left-[10px] top-[12px] h-full w-full rounded-[37px] bg-auchan-red-pastel" />

        {/* White card */}
        <div className="relative flex h-[670px] w-[464px] flex-col rounded-[30px] bg-white px-[45px] pb-[40px] pt-[70px]">
          {children}
        </div>
      </div>
    </div>
  );
}
