
"use client"

import CustomButton from "@/components/ui/render/CustomButton"
import { FilterDropdown } from "@/components/ui/render/FilterDropdown"
import type { FilterOption } from "@/components/ui/render/FilterDropdown"
import { cn } from "@/lib/utils"
import { Plus, Search } from "lucide-react"
import { useMemo } from "react"

type StoresHeaderProps = {
  search: string
  onSearchChange: (value: string) => void
  commune: string
  onCommuneChange: (value: string) => void
  communes: string[]
  onAddStore: () => void
}

const SEARCH_PLACEHOLDER = "Nom du magasin, code magasin, Commune"

export function StoresHeader({
  search,
  onSearchChange,
  commune,
  onCommuneChange,
  communes,
  onAddStore,
}: StoresHeaderProps) {
  const communeOptions: FilterOption[] = useMemo(
    () => communes.map((c) => ({ label: c, value: c })),
    [communes]
  )

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-[25px]">
      {/* Row 1 mobile: title + add button */}
      <div className="flex items-center justify-between lg:contents">
        <h1 className="text-[24px] lg:text-[36px] font-bold tracking-[-0.72px] lg:tracking-[-1.08px] text-black">
          Magasins
        </h1>

        {/* Add store button — mobile: icon only */}
        <CustomButton
          onClick={onAddStore}
          className="flex lg:hidden h-[36px] items-center rounded-[10px] bg-auchan-red px-3.5 text-[13px] font-bold tracking-[-0.39px] text-white hover:bg-auchan-red-hover"
          icon={{ render: <Plus size={15} strokeWidth={3} />, position: "left" }}
        >
          Ajouter
        </CustomButton>
      </div>

      {/* Row 2 mobile: search + commune filter */}
      <div className="flex items-center gap-2.5 lg:contents">
        {/* Search */}
        <div className="relative flex-1 lg:flex-none">
          <Search
            size={16}
            className="absolute left-[14px] top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={SEARCH_PLACEHOLDER}
            className={cn(
              "h-[36px] w-full lg:w-[351px] rounded-[18px] bg-border-light pl-[38px] pr-[14px]",
              "text-[12px] italic tracking-[-0.36px] text-text-caption",
              "placeholder:text-text-secondary focus:outline-none"
            )}
          />
        </div>

        {/* Commune filter */}
        <FilterDropdown
          options={communeOptions}
          value={commune}
          onChange={onCommuneChange}
          placeholder="Commune"
          allLabel="Toutes"
          align="right"
          chevronSize={17}
          triggerClassName="h-[36px] w-[130px] lg:w-[211px] shrink-0 justify-between rounded-[18px] bg-border-light px-[12px] lg:px-[16px] text-text-caption"
          dropdownClassName="w-[160px] lg:w-[211px] rounded-[12px] bg-white p-[6px] shadow-lg ring-1 ring-border-light"
          optionClassName="rounded-[8px] px-[12px] py-[8px] text-left hover:bg-surface-muted"
        />
      </div>

      {/* Spacer — desktop only */}
      <div className="hidden lg:block lg:flex-1" />

      {/* Add store button — desktop */}
      <CustomButton
        onClick={onAddStore}
        className="hidden lg:flex h-[50px] rounded-[10px] bg-auchan-red px-[20px] text-[18px] font-bold tracking-[-0.54px] text-white hover:bg-auchan-red-hover"
        icon={{ render: <Plus size={18} strokeWidth={3} />, position: "left" }}
      >
        Ajouter un magasin
      </CustomButton>
    </div>
  )
}
