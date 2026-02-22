"use client"

import CustomIcon from "@/components/ui/render/CustomIcon"
import ICONS from "@/constants/icons.constant"
import { cn } from "@/lib/utils"
import type { StoreDetail } from "@/services/stores/stores.types"

type StoreInfoCardProps = {
  store: StoreDetail
  className?: string
}

type InfoFieldProps = {
  label: string
  value: string | number
  labelSize?: string
}

function InfoField({ label, value, labelSize = "text-[16px]" }: InfoFieldProps) {
  return (
    <div className="flex flex-col gap-[4px]">
      <span
        className={cn(
          "font-medium line-clamp-1 break-all tracking-[-0.48px] text-text-tertiary",
          labelSize
        )}
      >
        {label}
      </span>
      <span className="text-[22px] line-clamp-1 break-all font-bold tracking-[-0.66px] text-foreground">
        {typeof value === "number" ? value.toLocaleString("fr-FR") : value}
      </span>
    </div>
  )
}

function DonutChart() {
  return (
    <div className="flex items-center shrink-0  gap-[24px]">
      <CustomIcon
        config={ICONS.stores.donutChart}
        className="size-[120px]"
      />
      <div className="flex flex-col gap-[16px]">
        <div className="flex items-center gap-[10px]">
          <span className="size-[11px] shrink-0 rounded-full bg-auchan-red" />
          <span className="text-[20px] font-bold tracking-[-0.6px] text-text-caption">
            Rendu monnaie
          </span>
        </div>
        <div className="flex items-center gap-[10px]">
          <span className="size-[11px] shrink-0 rounded-full bg-auchan-green" />
          <span className="text-[20px] font-bold tracking-[-0.6px] text-text-caption">
            Paiement course
          </span>
        </div>
      </div>
    </div>
  )
}

export function StoreInfoCard({ store, className }: StoreInfoCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-[20px] bg-white px-[56px] py-[32px]",
        className
      )}
    >
      <div className="grid grid-cols-3 justify-between w-full gap-x-[10px] gap-y-[24px]">
        <InfoField label="Nom du magasin" value={store.name} />
        <InfoField label="Manager" value={store.manager} labelSize="text-[18px]" />
        <InfoField label="Nombre de Caissiers" value={String(store.nbCaissiers).padStart(2, "0")} labelSize="text-[18px]" />
        <InfoField label="Localisation" value={store.city} />
        <InfoField label="Responsable Caisse" value={store.responsableCaisse} labelSize="text-[18px]" />
        <InfoField label="Nombre de Transaction" value={store.nbTransactions} labelSize="text-[18px]" />
      </div>
      <DonutChart />
    </div>
  )
}
