
"use client"

import { FilterDropdown } from "@/components/ui/render/FilterDropdown"
import { useStatsQuery } from "@/hooks/useDashboardController"
import { motion } from "framer-motion"
import { useState } from "react"

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
    <div className="flex flex-1 flex-col items-center justify-center gap-[20px]">
      <div className="relative">
        <div className="size-[235px] animate-pulse rounded-full border-[27px] border-surface-muted" />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div className="h-[36px] w-[60px] animate-pulse rounded-[8px] bg-surface-muted" />
          <div className="mt-[6px] h-[15px] w-[80px] animate-pulse rounded-[6px] bg-surface-muted" />
        </div>
      </div>
      <div className="flex gap-[30px]">
        <div className="h-[16px] w-[100px] animate-pulse rounded-[6px] bg-surface-muted" />
        <div className="h-[16px] w-[110px] animate-pulse rounded-[6px] bg-surface-muted" />
      </div>
    </div>
  )
}

export function StatisticsSection() {
  const [period, setPeriod] = useState("30days")
  const { renduMonnaie, paiementCourse, isLoading } = useStatsQuery(period)

  const stats = [
    { name: "Rendu monnaie", value: renduMonnaie, color: "var(--auchan-red)" },
    { name: "Paiement course", value: paiementCourse, color: "var(--auchan-green)" },
  ]
  const total = stats.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="flex w-[414px] h-[493px] justify-between shrink-0 flex-col rounded-[40px] bg-white px-[35px] pb-[40px] pt-[30px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[28px] font-bold tracking-[-0.84px] text-text-caption">
          Statistiques
        </h2>
        <FilterDropdown
          options={FILTER_OPTIONS}
          value={period}
          onChange={setPeriod}
          align="right"
          triggerClassName="h-[36px] rounded-[18px] bg-surface-muted px-[14px] text-text-caption"
          dropdownClassName="rounded-[20px] px-1 py-[6px] bg-surface-muted"
          optionClassName="whitespace-nowrap px-4 text-right rounded-xl py-[6px] hover:bg-white"
        />
      </div>

      {isLoading ? (
        <StatisticsSkeleton />
      ) : total > 0 ? (
        <>
          {/* Donut Chart */}
          <div className="relative mx-auto mt-[30px]">
            <svg width={DONUT_SIZE} height={DONUT_SIZE} viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}>
              <motion.path
                d={describeArc(
                  DONUT_CENTER, DONUT_CENTER, DONUT_RADIUS,
                  90 - (stats[0].value / total) * 360,
                  90 - 360
                )}
                fill="none"
                stroke={stats[1].color}
                strokeWidth={DONUT_STROKE}
                pathLength={1}
                initial={{ strokeDasharray: 1, strokeDashoffset: 1 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.8, delay: 0.55, ease: "easeOut" }}
              />
              <motion.path
                d={describeArc(
                  DONUT_CENTER, DONUT_CENTER, DONUT_RADIUS,
                  90,
                  90 - (stats[0].value / total) * 360
                )}
                fill="none"
                stroke={stats[0].color}
                strokeWidth={DONUT_STROKE}
                strokeLinecap="round"
                pathLength={1}
                initial={{ strokeDasharray: 1, strokeDashoffset: 1 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
              />
            </svg>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[36px] font-black uppercase leading-none tracking-[-1px] text-black">
                {total}
              </span>
              <span className="mt-[3px] text-[15px] font-medium leading-none text-black">
                Transactions
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-[30px] flex items-center justify-center gap-[30px]">
            {stats.map((entry) => (
              <div key={entry.name} className="flex items-center gap-[7px]">
                <div
                  className="size-[11px] shrink-0 rounded-[7.5px]"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-[16px] font-bold tracking-[-0.48px] text-text-caption">
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-[4px]">
          <p className="text-[18px] font-bold tracking-[-0.54px] text-text-caption">
            Aucune transaction
          </p>
          <p className="text-[14px] tracking-[-0.42px] text-text-secondary">
            Aucune donnée sur cette période.
          </p>
        </div>
      )}
    </div>
  )
}
