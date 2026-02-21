type InlineHighlightProps = {
  text: string
  search?: string
}

export function InlineHighlight({ text, search }: InlineHighlightProps) {
  if (!search || !text) return <>{text}</>

  const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="rounded-sm bg-auchan-red-light px-0.5 text-inherit">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  )
}
