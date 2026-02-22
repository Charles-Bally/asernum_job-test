
"use client"

import { FilterDropdown } from "@/components/ui/render/FilterDropdown"
import { useStatsQuery } from "@/hooks/useDashboardController"
import { AnimatePresence, motion } from "framer-motion"
import { useCallback, useState } from "react"

const DONUT_SIZE = 235
const DONUT_CENTER = DONUT_SIZE / 2
const DONUT_OUTER = 117
const DONUT_INNER = 90
const DONUT_RADIUS = (DONUT_OUTER + DONUT_INNER) / 2
const DONUT_STROKE = DONUT_OUTER - DONUT_INNER

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

const FILTER_OPTIONS = [
  { label: "Aujourd'hui", value: "today" },
  { label: "7 derniers jours", value: "7days" },
  { label: "30 derniers jours", value: "30days" },
  { label: "Cette année", value: "year" },
]

function StatisticsSkeleton() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5">
      <div className="relative">
        <div className="size-[170px] lg:size-[235px] animate-pulse rounded-full border-[20px] lg:border-[27px] border-surface-muted" />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div className="h-[28px] lg:h-[36px] w-[50px] lg:w-[60px] animate-pulse rounded-[8px] bg-surface-muted" />
          <div className="mt-[6px] h-[13px] lg:h-[15px] w-[65px] lg:w-[80px] animate-pulse rounded-[6px] bg-surface-muted" />
        </div>
      </div>
      <div className="flex gap-5 lg:gap-[30px]">
        <div className="h-[14px] lg:h-[16px] w-[90px] lg:w-[100px] animate-pulse rounded-[6px] bg-surface-muted" />
        <div className="h-[14px] lg:h-[16px] w-[100px] lg:w-[110px] animate-pulse rounded-[6px] bg-surface-muted" />
      </div>
    </div>
  )
}

type StatEntry = { name: string; value: number; color: string }

function DonutTooltip({ entry, total }: { entry: StatEntry; total: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.1 }}
      className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
    >
      <span className="text-[22px] lg:text-[32px] font-black leading-none tracking-[-0.6px] text-black">
        {entry.value.toLocaleString("fr-FR")}
      </span>
      <span className="mt-[2px] text-[10px] lg:text-[13px] font-bold leading-none" style={{ color: entry.color }}>
        {entry.name}
      </span>
      <span className="mt-[2px] text-[10px] lg:text-[12px] font-medium text-text-secondary">
        {Math.round((entry.value / total) * 100)}%
      </span>
    </motion.div>
  )
}

export function StatisticsSection() {
  const [period, setPeriod] = useState("30days")
  const { renduMonnaie, paiementCourse, isLoading } = useStatsQuery(period)
  const [hovered, setHovered] = useState<number | null>(null)

  const stats: StatEntry[] = [
    { name: "Rendu monnaie", value: renduMonnaie, color: "var(--auchan-red)" },
    { name: "Paiement course", value: paiementCourse, color: "var(--auchan-green)" },
  ]
  const total = stats.reduce((sum, item) => sum + item.value, 0)

  const clearHover = useCallback(() => setHovered(null), [])

  return (
    <div className="flex w-full lg:w-[414px] h-auto justify-between shrink-0 flex-col rounded-[20px] lg:rounded-[40px] bg-white px-4 lg:px-[35px] pb-6 lg:pb-[40px] pt-5 lg:pt-[30px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] lg:text-[28px] font-bold tracking-[-0.54px] lg:tracking-[-0.84px] text-text-caption">
          Statistiques
        </h2>
        <FilterDropdown
          options={FILTER_OPTIONS}
          value={period}
          onChange={setPeriod}
          align="right"
          triggerClassName="h-[32px] lg:h-[36px] rounded-[16px] lg:rounded-[18px] bg-surface-muted px-3 lg:px-[14px] text-[13px] lg:text-[14px] text-text-caption"
          dropdownClassName="rounded-[20px] px-1 py-[6px] bg-surface-muted"
          optionClassName="whitespace-nowrap px-4 text-right rounded-xl py-[6px] hover:bg-white"
        />
      </div>

      {isLoading ? (
        <StatisticsSkeleton />
      ) : total > 0 ? (
        <>
          {/* Donut Chart */}
          <div className="relative mx-auto mt-5 lg:mt-[30px]" onMouseLeave={clearHover}>
            <svg
              className="size-[170px] lg:size-[235px]"
              viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
            >
              {(hovered === 1 ? [0, 1] : [1, 0]).map((idx) => {
                const isRed = idx === 0
                const d = isRed
                  ? describeArc(DONUT_CENTER, DONUT_CENTER, DONUT_RADIUS, 90, 90 - (stats[0].value / total) * 360)
                  : describeArc(DONUT_CENTER, DONUT_CENTER, DONUT_RADIUS, 90 - (stats[0].value / total) * 360, 90 - 360)
                return (
                  <motion.path
                    key={isRed ? "red" : "green"}
                    d={d}
                    fill="none"
                    stroke={stats[idx].color}
                    strokeWidth={DONUT_STROKE}
                    strokeLinecap={isRed ? "round" : undefined}
                    opacity={hovered === null || hovered === idx ? 1 : 0.3}
                    className="transition-opacity duration-150 cursor-pointer"
                    pathLength={1}
                    initial={{ strokeDasharray: 1, strokeDashoffset: 1 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    onMouseEnter={() => setHovered(idx)}
                  />
                )
              })}
            </svg>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                {hovered !== null ? (
                  <DonutTooltip key="tooltip" entry={stats[hovered]} total={total} />
                ) : (
                  <motion.div
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <span className="text-[24px] lg:text-[36px] font-black uppercase leading-none tracking-[-0.7px] lg:tracking-[-1px] text-black">
                      {total}
                    </span>
                    <span className="mt-[2px] lg:mt-[3px] text-[11px] lg:text-[15px] font-medium leading-none text-black">
                      Transactions
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-5 lg:mt-[30px] flex items-center justify-center gap-4 lg:gap-[30px]">
            {stats.map((entry, i) => (
              <button
                type="button"
                key={entry.name}
                className="flex items-center gap-[6px] lg:gap-[7px] cursor-pointer"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={clearHover}
              >
                <div
                  className="size-[9px] lg:size-[11px] shrink-0 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-[12px] lg:text-[16px] font-bold tracking-[-0.36px] lg:tracking-[-0.48px] text-text-caption">
                  {entry.name}
                </span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-[4px] py-10 lg:py-0">
          <p className="text-[16px] lg:text-[18px] font-bold tracking-[-0.48px] lg:tracking-[-0.54px] text-text-caption">
            Aucune transaction
          </p>
          <p className="text-[13px] lg:text-[14px] tracking-[-0.39px] lg:tracking-[-0.42px] text-text-secondary">
            Aucune donnée sur cette période.
          </p>
        </div>
      )}
    </div>
  )
}
