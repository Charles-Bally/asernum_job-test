"use client"

import CustomButton from "@/components/ui/render/CustomButton"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Loader2 } from "lucide-react"
import type { SeedProgress } from "./demo-seed.types"
import { STEPS } from "./useSeedRunner"

interface SeedProgressOverlayProps {
  progress: SeedProgress
  onClose: () => void
}

export default function SeedProgressOverlay({ progress, onClose }: SeedProgressOverlayProps) {
  const { status, currentStep, error } = progress
  const isVisible = status !== "idle"
  const isDone = status === "success" || status === "error"
  const pct = status === "success"
    ? 100
    : Math.round((currentStep / STEPS.length) * 100)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-[420px] rounded-2xl border border-border-light bg-white p-6"
          >
            <h2 className="mb-1 text-lg font-bold text-foreground">
              {status === "error" ? "Erreur" : status === "success" ? "Seed terminé" : "Seed en cours..."}
            </h2>
            <p className="mb-5 text-sm text-text-secondary">
              {status === "error" ? error : status === "success"
                ? "La base a été réinitialisée avec succès."
                : progress.currentLabel}
            </p>

            <ProgressBar pct={pct} isError={status === "error"} />

            <ul className="mt-5 flex flex-col gap-2">
              {STEPS.map((step, i) => (
                <StepRow
                  key={step.path}
                  label={step.label}
                  index={i}
                  currentStep={currentStep}
                  status={status}
                />
              ))}
            </ul>

            {isDone && (
              <div className="mt-6">
                <CustomButton
                  onClick={onClose}
                  variant={status === "error" ? "danger" : "primary"}
                  className="h-12 w-full text-sm font-semibold"
                >
                  {status === "error" ? "Fermer" : "C'est compris"}
                </CustomButton>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ProgressBar({ pct, isError }: { pct: number; isError: boolean }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
      <motion.div
        className={cn("h-full rounded-full", isError ? "bg-auchan-red" : "bg-auchan-green")}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  )
}

function StepRow({
  label, index, currentStep, status,
}: {
  label: string; index: number; currentStep: number; status: string
}) {
  const done = status === "success" ? true : index < currentStep
  const active = status === "running" && index === currentStep
  const isError = status === "error" && index === currentStep

  return (
    <li className="flex items-center gap-3">
      <div className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
        done && "bg-auchan-green text-white",
        active && "bg-foreground text-white",
        isError && "bg-auchan-red text-white",
        !done && !active && !isError && "bg-surface-muted text-text-secondary",
      )}>
        {done ? <Check size={14} /> : active ? <Loader2 size={14} className="animate-spin" /> : index + 1}
      </div>
      <span className={cn(
        "text-sm",
        (done || active) ? "font-medium text-foreground" : "text-text-secondary",
        isError && "font-medium text-auchan-red",
      )}>
        {label}
      </span>
    </li>
  )
}
