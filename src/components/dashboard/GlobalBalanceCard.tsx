"use client"

import AuchanBird from "@/components/ui/render/AuchanBird"
import { useState } from "react"

function formatBalance(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(amount)
}

type GlobalBalanceCardProps = {
  balance: number
}

export function GlobalBalanceCard({ balance }: GlobalBalanceCardProps) {
  const [isVisible, setIsVisible] = useState(false)

  const toggle = () => setIsVisible((prev) => !prev)

  return (
    <div
      onClick={toggle}
      className="relative h-[322px] w-[354px] cursor-pointer overflow-hidden rounded-[40px] bg-auchan-red transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
    >
      {/* Bird background */}
      <AuchanBird
        eyeDirection={isVisible ? "bottom-left" : "top-right"}
        className="absolute right-[13%] top-[5%] w-[120%] pointer-events-none"
        bodyConfig={{ opacity: 0.2 }}
        eyeConfig={{ opacity: 1 }}
      />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col px-[39px] pt-[43px]">
        <h2 className="text-[26px] font-bold tracking-[-0.78px] text-white">
          Solde globale
        </h2>

        <p className="mt-[16px] text-[12px] font-bold tracking-[-0.36px] text-auchan-red-muted">
          {isVisible
            ? "Touchez l'oeil pour masquer le solde"
            : "Touchez l'oeil pour afficher le solde"}
        </p>

        <div className="mt-auto pb-[30px]">
          {isVisible ? (
            <p className="text-[40px] font-black uppercase leading-none tracking-[-1.2px] text-white">
              {formatBalance(balance)}
              <br />
              FCFA
            </p>
          ) : (
            <>
              <div className="flex gap-[8px]">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="size-[16px] rounded-full bg-white"
                  />
                ))}
              </div>
              <p className="mt-[10px] text-[40px] font-black uppercase leading-none text-white">
                FCFA
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
