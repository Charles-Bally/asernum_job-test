"use client"

import { GlobalBalanceCard } from "@/components/dashboard/GlobalBalanceCard"
import { StatisticsSection } from "@/components/dashboard/StatisticsSection"
import { TopStoresSection } from "@/components/dashboard/TopStoresSection"
import { useStatsQuery } from "@/hooks/useDashboardController"
import { StatsKpiRow } from "./StatsKpiRow"
import { TransactionsLineChart } from "./TransactionsLineChart"
import { motion, type Variants } from "framer-motion"

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

function ReturnRateCard() {
  const { renduMonnaie, paiementCourse, isLoading } = useStatsQuery("30days")
  const total = renduMonnaie + paiementCourse
  const rate = total > 0 ? Math.round((renduMonnaie / total) * 100) : 0

  return (
    <div className="flex flex-col justify-center rounded-[20px] lg:rounded-[40px] bg-white px-5 lg:px-[35px] py-5 lg:py-[25px]">
      {isLoading ? (
        <div className="flex flex-col gap-2">
          <div className="h-[13px] w-[100px] animate-pulse rounded-[5px] bg-surface-muted" />
          <div className="h-[28px] w-[70px] animate-pulse rounded-[8px] bg-surface-muted" />
          <div className="mt-1 h-[6px] w-full animate-pulse rounded-full bg-surface-muted" />
        </div>
      ) : (
        <>
          <span className="text-[11px] lg:text-[13px] font-medium text-text-secondary">
            Taux de rendu monnaie
          </span>
          <span className="text-[26px] lg:text-[32px] font-black tracking-[-0.78px] lg:tracking-[-1px] text-foreground">
            {rate}%
          </span>
          <div className="mt-2 h-[6px] w-full rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-auchan-red transition-all"
              style={{ width: `${rate}%` }}
            />
          </div>
          <span className="mt-1.5 text-[11px] lg:text-[12px] text-text-secondary">
            {renduMonnaie.toLocaleString("fr-FR")} rendus sur {total.toLocaleString("fr-FR")} transactions
          </span>
        </>
      )}
    </div>
  )
}

export function StatistiquesContent() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 lg:gap-[20px]"
    >
      {/* Row 1 : (Solde + Taux rendu) + Donut chart */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-[20px]">
        <motion.div variants={fadeUp} className="flex flex-col gap-4 lg:gap-[20px] lg:w-auto">
          <GlobalBalanceCard />
          <ReturnRateCard />
        </motion.div>
        <motion.div variants={fadeUp} className="flex-1 min-w-0 [&>div]:!w-full">
          <StatisticsSection />
        </motion.div>
      </div>

      {/* Row 2 : KPIs texte */}
      <motion.div variants={fadeUp}>
        <StatsKpiRow />
      </motion.div>

      {/* Row 3 : Line chart pleine largeur */}
      <motion.div variants={fadeUp}>
        <TransactionsLineChart />
      </motion.div>

      {/* Row 4 : Top magasins */}
      <motion.div variants={fadeUp}>
        <TopStoresSection />
      </motion.div>
    </motion.div>
  )
}
