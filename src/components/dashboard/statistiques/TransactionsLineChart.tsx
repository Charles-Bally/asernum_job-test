"use client"

import { useBalanceQuery } from "@/hooks/useDashboardController"
import { FilterDropdown } from "@/components/ui/render/FilterDropdown"
import { useMemo, useState } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

const FILTER_OPTIONS = [
  { label: "7 derniers jours", value: "7days" },
  { label: "30 derniers jours", value: "30days" },
  { label: "Cette année", value: "year" },
]

function formatFCFA(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value)
}

function formatYAxis(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`
  return String(value)
}

function generateMoneyData(balance: number, period: string) {
  const points = period === "7days" ? 7 : period === "year" ? 12 : 30
  const labels =
    period === "year"
      ? ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]
      : Array.from({ length: points }, (_, i) => `J${i + 1}`)

  const avgEntree = balance / points
  const avgSortie = avgEntree * 0.7

  return labels.map((label) => ({
    name: label,
    entrees: Math.round(avgEntree * (0.6 + Math.random() * 0.8)),
    sorties: Math.round(avgSortie * (0.6 + Math.random() * 0.8)),
  }))
}

function ChartSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="h-[22px] lg:h-[28px] w-[200px] animate-pulse rounded-[8px] bg-surface-muted" />
        <div className="h-[32px] w-[130px] animate-pulse rounded-[16px] bg-surface-muted" />
      </div>
      <div className="mt-2 flex gap-5">
        <div className="h-[13px] w-[80px] animate-pulse rounded-[5px] bg-surface-muted" />
        <div className="h-[13px] w-[60px] animate-pulse rounded-[5px] bg-surface-muted" />
      </div>
      <div className="h-[220px] lg:h-[280px] w-full animate-pulse rounded-[16px] bg-surface-muted" />
    </div>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-[12px] bg-white px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <p className="text-[12px] font-medium text-text-secondary">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} className="text-[13px] font-bold" style={{ color: entry.color }}>
          {entry.name} : {formatFCFA(entry.value)} FCFA
        </p>
      ))}
    </div>
  )
}

export function TransactionsLineChart() {
  const [period, setPeriod] = useState("30days")
  const { balance, isLoading } = useBalanceQuery()

  const data = useMemo(
    () => generateMoneyData(balance, period),
    [balance, period]
  )

  return (
    <div className="rounded-[20px] lg:rounded-[40px] bg-white px-5 lg:px-[35px] py-5 lg:py-[30px]">
      {isLoading ? (
        <ChartSkeleton />
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] lg:text-[28px] font-bold tracking-[-0.54px] lg:tracking-[-0.84px] text-text-caption">
              Flux financier
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

          <div className="mt-3 lg:mt-4 flex items-center gap-5">
            <div className="flex items-center gap-[6px]">
              <div className="size-[9px] rounded-full bg-auchan-green" />
              <span className="text-[12px] lg:text-[14px] font-medium text-text-secondary">
                Entrées
              </span>
            </div>
            <div className="flex items-center gap-[6px]">
              <div className="size-[9px] rounded-full bg-auchan-red" />
              <span className="text-[12px] lg:text-[14px] font-medium text-text-secondary">
                Sorties
              </span>
            </div>
          </div>

          <div className="mt-4 lg:mt-5 h-[220px] lg:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
                  tickLine={false}
                  axisLine={false}
                  interval={period === "30days" ? 4 : 0}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
                  tickLine={false}
                  axisLine={false}
                  width={45}
                  tickFormatter={formatYAxis}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="entrees"
                  name="Entrées"
                  stroke="var(--auchan-green)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="sorties"
                  name="Sorties"
                  stroke="var(--auchan-red)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}
