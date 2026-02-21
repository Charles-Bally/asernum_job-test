
"use client"

import { StoresGrid } from "@/components/dashboard/StoresGrid"
import { StoresHeader } from "@/components/dashboard/StoresHeader"
import { PaginationControls } from "@/components/table_system"
import { useListingParams } from "@/hooks/useListingParams"
import { useStoresQuery } from "@/hooks/useStoresController"
import { useQueryState } from "nuqs"
import { useCallback } from "react"

export default function StoreListingPage() {
  const { search, setSearch, page, setPage, withPageReset } = useListingParams()
  const [commune, rawSetCommune] = useQueryState("commune", { defaultValue: "" })
  const setCommune = withPageReset(rawSetCommune)

  const { stores, communes, page: currentPage, totalPages, isLoading } = useStoresQuery({
    search,
    commune,
    page,
  })

  const handleAddStore = useCallback(() => {
    console.log("Ajouter un magasin")
  }, [])

  return (
    <div className="flex flex-col gap-[30px]">
      <StoresHeader
        search={search}
        onSearchChange={setSearch}
        commune={commune}
        onCommuneChange={setCommune}
        communes={communes}
        onAddStore={handleAddStore}
      />

      <StoresGrid
        stores={stores}
        isLoading={isLoading}
        onAddStore={handleAddStore}
      />

      <PaginationControls
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}
