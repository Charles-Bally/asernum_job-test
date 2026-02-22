
"use client"

import { GlobalBalanceCard } from "@/components/dashboard/GlobalBalanceCard"
import { StatisticsSection } from "@/components/dashboard/StatisticsSection"
import { TopStoresSection } from "@/components/dashboard/TopStoresSection"
import { TransactionsPreview } from "@/components/dashboard/TransactionsPreview"
import { motion, type Variants } from "framer-motion"

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
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
      <motion.div variants={item} className="flex flex-col lg:flex-row gap-4 lg:gap-[20px]">
        <GlobalBalanceCard />
        <TopStoresSection />
      </motion.div>

      {/* Row 2 : Transactions + Statistiques */}
      <motion.div variants={item} className="flex flex-col lg:flex-row gap-4 lg:gap-[20px]">
        <TransactionsPreview />
        <StatisticsSection />
      </motion.div>
    </motion.div>
  )
}
