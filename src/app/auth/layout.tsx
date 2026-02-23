"use client";

import DemoTools from "@/components/demo/DemoTools";
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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/9 w-[calc(100%-70px)] pointer-events-none hidden md:block"
      />

      <div className="relative z-10 mx-4 w-full max-w-[464px] md:mx-0 md:w-auto">
        {/* Shadow card */}
        <div className="absolute left-[10px] top-[12px] h-full w-full rounded-[37px] bg-auchan-red-pastel" />

        {/* White card */}
        <div className="relative flex h-[calc(100dvh-40px)] w-full flex-col overflow-y-auto rounded-[30px] bg-white px-6 pb-8 pt-12 md:h-[670px] md:overflow-y-visible md:max-w-[464px] md:px-[45px] md:pb-[40px] md:pt-[70px]">
          {children}
        </div>
      </div>

      <DemoTools />
    </div>
  );
}
