import DemoTools from "@/components/demo/DemoTools"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

vi.mock("framer-motion", async () => {
  const actual = await vi.importActual<typeof import("framer-motion")>("framer-motion")
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    motion: {
      div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
      button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
    },
  }
})

describe("DemoTools", () => {
  it("affiche le bouton flottant avec une opacité réduite", () => {
    render(<DemoTools />)

    const trigger = screen.getByRole("button")
    expect(trigger).toBeInTheDocument()
    expect(trigger.className).toContain("opacity-40")
  })

  it("ouvre le panneau au clic et affiche les 2 actions", async () => {
    const user = userEvent.setup()
    render(<DemoTools />)

    await user.click(screen.getByRole("button"))

    expect(screen.getByText("Demo Tools")).toBeInTheDocument()
    expect(screen.getByText("Reset & Seed")).toBeInTheDocument()
    expect(screen.getByText("Clear Database")).toBeInTheDocument()
  })

  it("affiche les descriptions des actions", async () => {
    const user = userEvent.setup()
    render(<DemoTools />)

    await user.click(screen.getByRole("button"))

    expect(screen.getByText("Réinitialise et remplit la base")).toBeInTheDocument()
    expect(screen.getByText("Vide la base (garde l'admin)")).toBeInTheDocument()
  })

  it("ferme le panneau au second clic sur le bouton trigger", async () => {
    const user = userEvent.setup()
    render(<DemoTools />)

    await user.click(screen.getByRole("button"))
    expect(screen.getByText("Demo Tools")).toBeInTheDocument()

    const buttons = screen.getAllByRole("button")
    const trigger = buttons[buttons.length - 1]
    await user.click(trigger)

    expect(screen.queryByText("Demo Tools")).not.toBeInTheDocument()
  })

  it("appelle fetch pour la première étape seed au clic sur Reset & Seed", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ status: "success", data: { adminId: "test-id" } }),
    })
    global.fetch = mockFetch

    const user = userEvent.setup()
    render(<DemoTools />)

    await user.click(screen.getByRole("button"))
    await user.click(screen.getByText("Reset & Seed"))

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/demo/seed/wipe",
      expect.objectContaining({ method: "POST" }),
    )
  })

  it("appelle fetch avec la bonne URL au clic sur Clear Database", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ status: "success" }),
    })
    global.fetch = mockFetch

    const user = userEvent.setup()
    render(<DemoTools />)

    await user.click(screen.getByRole("button"))
    await user.click(screen.getByText("Clear Database"))

    expect(mockFetch).toHaveBeenCalledWith("/api/demo/clear", { method: "POST" })
  })
})
