
"use client"

import { cn } from "@/lib/utils"
import type { StoreDetail } from "@/services/stores/stores.types"
import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useState } from "react"

type StoreInfoCardProps = {
  store: StoreDetail
  className?: string
}

type InfoFieldProps = {
  label: string
  value: string | number
}

function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div className="flex flex-col gap-[2px] lg:gap-[4px]">
      <span className="text-[12px] lg:text-[16px] font-medium line-clamp-1 break-all tracking-[-0.36px] lg:tracking-[-0.48px] text-text-tertiary">
        {label}
      </span>
      <span className="text-[16px] lg:text-[22px] line-clamp-1 break-all font-bold tracking-[-0.48px] lg:tracking-[-0.66px] text-foreground">
        {typeof value === "number" ? value.toLocaleString("fr-FR") : value}
      </span>
    </div>
  )
}

type DonutSegment = {
  name: string
  value: number
  color: string
}

function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const startRad = (startDeg * Math.PI) / 180
  const endRad = (endDeg * Math.PI) / 180
  const x1 = cx + r * Math.cos(startRad)
  const y1 = cy - r * Math.sin(startRad)
  const x2 = cx + r * Math.cos(endRad)
  const y2 = cy - r * Math.sin(endRad)
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0
  const sweep = startDeg > endDeg ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} ${sweep} ${x2} ${y2}`
}

const SIZE = 120
const CENTER = SIZE / 2
const OUTER = 60
const INNER = 46
const RADIUS = (OUTER + INNER) / 2
const STROKE = OUTER - INNER

function InteractiveDonut({ stats }: { stats: { renduMonnaie: number; paiementCourse: number } }) {
  const [hovered, setHovered] = useState<number | null>(null)

  const segments: DonutSegment[] = [
    { name: "Rendu monnaie", value: stats.renduMonnaie, color: "var(--auchan-red)" },
    { name: "Paiement course", value: stats.paiementCourse, color: "var(--auchan-green)" },
  ]
  const total = segments[0].value + segments[1].value

  const clearHover = useCallback(() => setHovered(null), [])

  if (total === 0) {
    return (
      <div className="flex items-center shrink-0 gap-4 lg:gap-[24px]">
        <div className="size-[80px] lg:size-[120px] rounded-full border-[10px] lg:border-[14px] border-surface-muted" />
        <Legend segments={segments} />
      </div>
    )
  }

  const renduAngle = (segments[0].value / total) * 360
  const renduPath = describeArc(CENTER, CENTER, RADIUS, 90, 90 - renduAngle)
  const coursePath = describeArc(CENTER, CENTER, RADIUS, 90 - renduAngle, 90 - 360)

  return (
    <div className="flex items-center shrink-0 gap-4 lg:gap-[24px]">
      <div className="relative">
        <svg
          className="size-[80px] lg:size-[120px]"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          onMouseLeave={clearHover}
        >
          {(hovered === 1 ? [0, 1] : [1, 0]).map((idx) => {
            const isRed = idx === 0
            return (
              <path
                key={isRed ? "red" : "green"}
                d={isRed ? renduPath : coursePath}
                fill="none"
                stroke={segments[idx].color}
                strokeWidth={STROKE}
                strokeLinecap={isRed ? "round" : undefined}
                opacity={hovered === null || hovered === idx ? 1 : 0.3}
                className="transition-opacity duration-150 cursor-pointer"
                onMouseEnter={() => setHovered(idx)}
              />
            )
          })}
        </svg>

        <AnimatePresence>
          {hovered !== null && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.1 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap rounded-[10px] bg-foreground px-3 py-2 shadow-lg"
            >
              <p className="text-[11px] font-bold text-white">{segments[hovered].name}</p>
              <p className="text-[10px] text-white/80">
                {segments[hovered].value.toLocaleString("fr-FR")} — {Math.round((segments[hovered].value / total) * 100)}%
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Legend segments={segments} />
    </div>
  )
}

function Legend({ segments }: { segments: DonutSegment[] }) {
  return (
    <div className="flex flex-col gap-2.5 lg:gap-[16px]">
      {segments.map((s) => (
        <div key={s.name} className="flex items-center gap-2 lg:gap-[10px]">
          <span className="size-[9px] lg:size-[11px] shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
          <span className="text-[14px] lg:text-[20px] font-bold tracking-[-0.42px] lg:tracking-[-0.6px] text-text-caption">
            {s.name}
          </span>
        </div>
      ))}
    </div>
  )
}

export function StoreInfoCard({ store, className }: StoreInfoCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row lg:items-center justify-between rounded-[20px] bg-white",
        "px-5 py-5 lg:px-[56px] lg:py-[32px] gap-5 lg:gap-0",
        className
      )}
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 w-full gap-x-3 lg:gap-x-[10px] gap-y-4 lg:gap-y-[24px]">
        <InfoField label="Nom du magasin" value={store.name} />
        <InfoField label="Manager" value={store.manager} />
        <InfoField label="Nombre de Caissiers" value={String(store.nbCaissiers).padStart(2, "0")} />
        <InfoField label="Localisation" value={store.city} />
        <InfoField label="Responsable Caisse" value={store.responsableCaisse} />
        <InfoField label="Nombre de Transaction" value={store.nbTransactions} />
      </div>
      <InteractiveDonut stats={store.stats} />
    </div>
  )
}
