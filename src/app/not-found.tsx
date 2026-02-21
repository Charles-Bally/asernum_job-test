"use client"

import AuchanBird from "@/components/ui/render/AuchanBird"
import CustomLink from "@/components/ui/render/CustomLink"
import { PATHNAME } from "@/constants/pathname.constant"

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-auchan-red px-6">
      <AuchanBird
        eyeDirection="bottom-left"
        opacity={0.15}
        className="pointer-events-none absolute left-1/2 top-1/2 w-[500px] -translate-x-1/2 -translate-y-1/2"
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <p className="text-[160px] font-black leading-none text-white">
          404
        </p>

        <h1 className="mt-[8px] text-[28px] font-bold tracking-[-0.84px] text-white">
          Page introuvable
        </h1>

        <p className="mt-[12px] max-w-[360px] text-[16px] font-medium tracking-[-0.48px] text-auchan-red-muted">
          {"La page que vous recherchez n'existe pas ou a été déplacée."}
        </p>

        <CustomLink
          href={PATHNAME.DASHBOARD.home}
          variant="none"
          className="mt-[32px] rounded-[14px] bg-white px-[28px] py-[14px] text-[18px] font-bold tracking-[-0.54px] text-auchan-red"
        >
          {"Retour à l'accueil"}
        </CustomLink>
      </div>
    </div>
  )
}
