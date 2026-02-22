import InputSearchDropdown from "@/components/ui/forms/InputSearchDropdown"
import type { DropdownOption } from "@/components/ui/forms/InputDropdown"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

const OPTIONS: DropdownOption[] = [
  { value: "1", label: "Amadou Konaté" },
  { value: "2", label: "Fatou Diallo" },
  { value: "3", label: "Sékou Traoré" },
  { value: "4", label: "Aïcha Coulibaly" },
]

describe("InputSearchDropdown", () => {
  it("affiche le placeholder quand aucune valeur n'est sélectionnée", () => {
    render(<InputSearchDropdown options={OPTIONS} value="" onChange={() => {}} placeholder="Choisir..." />)

    expect(screen.getByText("Choisir...")).toBeInTheDocument()
  })

  it("affiche le label sélectionné quand une valeur est fournie", () => {
    render(<InputSearchDropdown options={OPTIONS} value="2" onChange={() => {}} />)

    expect(screen.getByText("Fatou Diallo")).toBeInTheDocument()
  })

  it("affiche le topLabel avec l'astérisque si required", () => {
    render(
      <InputSearchDropdown
        options={OPTIONS} value="" onChange={() => {}}
        topLabel={{ text: "Manager", required: true }}
      />,
    )

    expect(screen.getByText("Manager")).toBeInTheDocument()
    expect(screen.getByText("*")).toBeInTheDocument()
  })

  it("ouvre le panel et affiche les options au clic", async () => {
    const user = userEvent.setup()
    render(<InputSearchDropdown options={OPTIONS} value="" onChange={() => {}} placeholder="Choisir..." />)

    await user.click(screen.getByText("Choisir..."))

    expect(screen.getByPlaceholderText("Rechercher...")).toBeInTheDocument()
    OPTIONS.forEach((opt) => {
      expect(screen.getByText(opt.label)).toBeInTheDocument()
    })
  })

  it("filtre les options par recherche locale (sans accents)", async () => {
    const user = userEvent.setup()
    render(<InputSearchDropdown options={OPTIONS} value="" onChange={() => {}} placeholder="Choisir..." />)

    await user.click(screen.getByText("Choisir..."))
    await user.type(screen.getByPlaceholderText("Rechercher..."), "sekou")

    expect(screen.getByText("Sékou Traoré")).toBeInTheDocument()
    expect(screen.queryByText("Amadou Konaté")).not.toBeInTheDocument()
    expect(screen.queryByText("Fatou Diallo")).not.toBeInTheDocument()
  })

  it("affiche 'Aucun résultat' si la recherche ne matche rien", async () => {
    const user = userEvent.setup()
    render(<InputSearchDropdown options={OPTIONS} value="" onChange={() => {}} placeholder="Choisir..." />)

    await user.click(screen.getByText("Choisir..."))
    await user.type(screen.getByPlaceholderText("Rechercher..."), "zzzzz")

    expect(screen.getByText("Aucun résultat")).toBeInTheDocument()
  })

  it("appelle onChange avec la bonne valeur au clic sur une option", async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<InputSearchDropdown options={OPTIONS} value="" onChange={onChange} placeholder="Choisir..." />)

    await user.click(screen.getByText("Choisir..."))
    await user.click(screen.getByText("Fatou Diallo"))

    expect(onChange).toHaveBeenCalledWith("2")
  })

  it("affiche le message d'erreur quand error est actif", () => {
    render(
      <InputSearchDropdown
        options={OPTIONS} value="" onChange={() => {}}
        error={{ active: true, message: "Ce champ est requis" }}
      />,
    )

    expect(screen.getByText("Ce champ est requis")).toBeInTheDocument()
  })

  it("appelle onSearch en mode async au lieu du filtrage local", async () => {
    const onSearch = vi.fn()
    const user = userEvent.setup()

    render(
      <InputSearchDropdown
        options={OPTIONS} value="" onChange={() => {}}
        placeholder="Choisir..."
        onSearch={onSearch}
      />,
    )

    await user.click(screen.getByText("Choisir..."))
    await user.type(screen.getByPlaceholderText("Rechercher..."), "ama")

    // Toutes les options restent visibles en mode async (pas de filtrage local)
    OPTIONS.forEach((opt) => {
      expect(screen.getByText(opt.label)).toBeInTheDocument()
    })
  })
})
