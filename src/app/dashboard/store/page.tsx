
"use client"

import { StoresGrid } from "@/components/dashboard/StoresGrid"
import { StoresHeader } from "@/components/dashboard/StoresHeader"
import { StoresInfiniteGrid } from "@/components/dashboard/StoresInfiniteGrid"
import { ScrollToTopFAB } from "@/components/ui/render/ScrollToTopFAB"
import { PaginationControls } from "@/components/table_system"
import { useInfiniteStoresQuery } from "@/hooks/useInfiniteStoresController"
import { useListingParams } from "@/hooks/useListingParams"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useStoresQuery } from "@/hooks/useStoresController"
import { useModal } from "@/components/modal_system"
import { useQueryState } from "nuqs"
import { useCallback } from "react"

export default function StoreListingPage() {
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const { search, setSearch, page, setPage, withPageReset } = useListingParams()
  const [commune, rawSetCommune] = useQueryState("commune", { defaultValue: "" })
  const setCommune = withPageReset(rawSetCommune)

  const modal = useModal()
  const handleAddStore = useCallback(() => {
    modal.open({ entity: "add-store", mode: "create", layout: "wizard" })
  }, [modal])

  return (
    <div className="flex flex-col gap-5 lg:gap-[30px]">
      {isDesktop ? (
        <DesktopView
          search={search} onSearchChange={setSearch}
          commune={commune} onCommuneChange={setCommune}
          page={page} onPageChange={setPage} onAddStore={handleAddStore}
        />
      ) : (
        <MobileView
          search={search} onSearchChange={setSearch}
          commune={commune} onCommuneChange={setCommune}
          onAddStore={handleAddStore}
        />
      )}
    </div>
  )
}

type DesktopViewProps = {
  search: string; onSearchChange: (v: string) => void
  commune: string; onCommuneChange: (v: string) => void
  page: number; onPageChange: (v: number) => void
  onAddStore: () => void
}

function DesktopView({ search, onSearchChange, commune, onCommuneChange, page, onPageChange, onAddStore }: DesktopViewProps) {
  const { stores, communes, page: currentPage, totalPages, isLoading } =
    useStoresQuery({ search, commune, page })

  return (
    <>
      <StoresHeader
        search={search} onSearchChange={onSearchChange}
        commune={commune} onCommuneChange={onCommuneChange}
        communes={communes} onAddStore={onAddStore}
      />
      <StoresGrid stores={stores} isLoading={isLoading} onAddStore={onAddStore} />
      <PaginationControls page={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </>
  )
}

type MobileViewProps = {
  search: string; onSearchChange: (v: string) => void
  commune: string; onCommuneChange: (v: string) => void
  onAddStore: () => void
}

function MobileView({ search, onSearchChange, commune, onCommuneChange, onAddStore }: MobileViewProps) {
  const { stores, communes, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteStoresQuery({ search, commune })

  return (
    <>
      <StoresHeader
        search={search} onSearchChange={onSearchChange}
        commune={commune} onCommuneChange={onCommuneChange}
        communes={communes} onAddStore={onAddStore}
      />
      <StoresInfiniteGrid
        stores={stores} isLoading={isLoading}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage} onAddStore={onAddStore}
      />
      <ScrollToTopFAB />
    </>
  )
}
