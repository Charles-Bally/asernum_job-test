
"use client"

import AuchanBird from "@/components/ui/render/AuchanBird"
import { useBalanceQuery } from "@/hooks/useDashboardController"
import { useState } from "react"

function formatBalance(amount: number): string {
  return new Intl.NumberFormat("fr-FR").format(amount)
}

function GlobalBalanceCardSkeleton() {
  return (
    <div className="relative h-[200px] lg:h-[330px] w-full lg:w-[354px] overflow-hidden rounded-[20px] lg:rounded-[40px] bg-auchan-red">
      <div className="relative z-10 flex h-full flex-col px-5 lg:px-[39px] pt-6 lg:pt-[43px]">
        <div className="h-[22px] lg:h-[26px] w-[140px] lg:w-[160px] animate-pulse rounded-[8px] bg-white/20" />
        <div className="mt-3 lg:mt-[16px] h-[12px] w-[180px] lg:w-[220px] animate-pulse rounded-[6px] bg-white/15" />
        <div className="mt-auto pb-6 lg:pb-[30px]">
          <div className="h-[32px] lg:h-[40px] w-[150px] lg:w-[180px] animate-pulse rounded-[8px] bg-white/20" />
          <div className="mt-[8px] h-[32px] lg:h-[40px] w-[70px] lg:w-[80px] animate-pulse rounded-[8px] bg-white/20" />
        </div>
      </div>
    </div>
  )
}

export function GlobalBalanceCard() {
  const [isVisible, setIsVisible] = useState(false)
  const { balance, isLoading } = useBalanceQuery()

  if (isLoading) return <GlobalBalanceCardSkeleton />

  const toggle = () => setIsVisible((prev) => !prev)

  return (
    <div
      onClick={toggle}
      className="relative h-[200px] lg:h-[330px] w-full lg:w-[354px] cursor-pointer overflow-hidden rounded-[20px] lg:rounded-[40px] bg-auchan-red transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]"
    >
      <AuchanBird
        eyeDirection={isVisible ? "bottom-left" : "top-right"}
        className="absolute right-[13%] top-[5%] w-[120%] pointer-events-none"
        bodyConfig={{ opacity: 0.2 }}
        eyeConfig={{ opacity: 1 }}
      />

      <div className="relative z-10 flex h-full flex-col px-5 lg:px-[39px] pt-6 lg:pt-[43px]">
        <h2 className="text-[20px] lg:text-[26px] font-bold tracking-[-0.6px] lg:tracking-[-0.78px] text-white">
          Solde globale
        </h2>

        <p className="mt-2 lg:mt-[16px] text-[11px] lg:text-[12px] font-bold tracking-[-0.33px] lg:tracking-[-0.36px] text-auchan-red-muted">
          {isVisible
            ? "Touchez l'oeil pour masquer le solde"
            : "Touchez l'oeil pour afficher le solde"}
        </p>

        <div className="mt-auto pb-5 lg:pb-[30px]">
          {isVisible ? (
            <p className="text-[32px] lg:text-[40px] font-black uppercase leading-none tracking-[-0.96px] lg:tracking-[-1.2px] text-white">
              {formatBalance(balance)}
              <br />
              FCFA
            </p>
          ) : (
            <>
              <div className="flex gap-[6px] lg:gap-[8px]">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="size-[12px] lg:size-[16px] rounded-full bg-white" />
                ))}
              </div>
              <p className="mt-[8px] lg:mt-[10px] text-[32px] lg:text-[40px] font-black uppercase leading-none text-white">
                FCFA
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
