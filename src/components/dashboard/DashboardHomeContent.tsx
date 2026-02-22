"use client"

import { GlobalBalanceCard } from "@/components/dashboard/GlobalBalanceCard"
import { StatisticsSection } from "@/components/dashboard/StatisticsSection"
import { TopStoresSection } from "@/components/dashboard/TopStoresSection"
import { TransactionsPreview } from "@/components/dashboard/TransactionsPreview"
import { motion, type Variants } from "framer-motion"

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export function DashboardHomeContent() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 lg:gap-[20px]"
    >
      {/* Row 1 : Solde + Magasins */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-[20px]">
        <motion.div variants={fadeUp} className="lg:w-auto h-full">
          <GlobalBalanceCard />
        </motion.div>
        <motion.div variants={fadeUp} className="flex-1 min-w-0">
          <TopStoresSection />
        </motion.div>
      </div>

      {/* Row 2 : Transactions + Statistiques */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-[20px]">
        <motion.div variants={fadeUp} className="flex-1 min-w-0">
          <TransactionsPreview />
        </motion.div>
        <motion.div variants={fadeUp} className="lg:w-auto">
          <StatisticsSection />
        </motion.div>
      </div>
    </motion.div>
  )
}
