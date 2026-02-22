"use client"

import { ClientsTable } from "./ClientsTable"

export function ClientsContent() {
  return (

    <div className="overflow-hidden rounded-[20px] lg:rounded-[30px] bg-white">
      <ClientsTable />
    </div>
  )
}
