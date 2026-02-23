"use client"

import { cn } from "@/lib/utils"
import { toast, TOAST } from "@/components/toast_system/services/toast.service"
import { AnimatePresence, motion } from "framer-motion"
import { Database, Loader2, Trash2, Wrench, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import SeedProgressOverlay from "./SeedProgressOverlay"
import { useSeedRunner } from "./useSeedRunner"

export default function DemoTools() {
  const [open, setOpen] = useState(false)
  const [clearing, setClearing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const { progress, run, reset } = useSeedRunner()

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      setOpen(false)
    }
  }, [])

  useEffect(() => {
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open, handleClickOutside])

  const runSeed = async () => {
    setOpen(false)
    await run()
  }

  const handleSeedClose = () => {
    if (progress.status === "success") {
      toast({ type: TOAST.SUCCESS as "success", message: "Base remplie avec succès" })
    }
    reset()
  }

  const runClear = async () => {
    setClearing(true)
    try {
      const res = await fetch("/api/demo/clear", { method: "POST" })
      const json = await res.json()
      if (json.status === "success") {
        toast({ type: TOAST.SUCCESS as "success", message: "Base vidée avec succès" })
        setOpen(false)
      } else {
        toast({ type: TOAST.ERROR as "error", message: json.error ?? "Erreur inconnue" })
      }
    } catch {
      toast({ type: TOAST.ERROR as "error", message: "Erreur réseau" })
    } finally {
      setClearing(false)
    }
  }

  const isBusy = clearing || progress.status === "running"

  return (
    <>
      <SeedProgressOverlay progress={progress} onClose={handleSeedClose} />

      <div ref={panelRef} className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute bottom-14 right-0 w-[260px] rounded-2xl bg-white p-4 shadow-xl"
            >
              <p className="mb-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">
                Demo Tools
              </p>

              <div className="flex flex-col gap-2">
                <DemoAction
                  icon={<Database size={16} />}
                  label="Reset & Seed"
                  description="Réinitialise et remplit la base"
                  loading={progress.status === "running"}
                  disabled={isBusy}
                  onClick={runSeed}
                />
                <DemoAction
                  icon={<Trash2 size={16} />}
                  label="Clear Database"
                  description="Vide la base (garde l'admin)"
                  loading={clearing}
                  disabled={isBusy}
                  onClick={runClear}
                />
              </div>

              <div className="absolute -bottom-[6px] right-5 size-3 rotate-45 bg-white shadow-sm" />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "flex size-11 cursor-pointer items-center justify-center rounded-full shadow-lg transition-all duration-200",
            "bg-foreground text-white",
            open ? "opacity-100 scale-105" : "opacity-40 hover:opacity-100 hover:scale-105"
          )}
        >
          {open ? <X size={18} /> : <Wrench size={18} />}
        </button>
      </div>
    </>
  )
}

function DemoAction({
  icon, label, description, loading, disabled, onClick,
}: {
  icon: React.ReactNode
  label: string
  description: string
  loading: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
        disabled && !loading ? "opacity-40 cursor-not-allowed" : "hover:bg-surface-subtle"
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-text-tertiary">
        {loading ? <Loader2 size={16} className="animate-spin" /> : icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-text-secondary">{description}</p>
      </div>
    </button>
  )
}
