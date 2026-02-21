import { type CSSProperties, type RefObject, useCallback, useEffect, useState } from "react"

const FADE_SIZE = 60

function buildMask(left: number, right: number): CSSProperties {
  if (left === 0 && right === 0) return {}

  const l = Math.round(left * FADE_SIZE)
  const r = Math.round(right * FADE_SIZE)
  const mask = `linear-gradient(to right, transparent 0%, black ${l}px, black calc(100% - ${r}px), transparent 100%)`

  return { maskImage: mask, WebkitMaskImage: mask }
}

export function useScrollMask(ref: RefObject<HTMLDivElement | null>) {
  const [style, setStyle] = useState<CSSProperties>({})

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return

    const { scrollLeft, scrollWidth, clientWidth } = el
    const maxScroll = scrollWidth - clientWidth

    if (maxScroll <= 0) {
      setStyle({})
      return
    }

    const leftProgress = Math.min(scrollLeft / FADE_SIZE, 1)
    const rightProgress = Math.min((maxScroll - scrollLeft) / FADE_SIZE, 1)
    setStyle(buildMask(leftProgress, rightProgress))
  }, [ref])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.addEventListener("scroll", update, { passive: true })
    requestAnimationFrame(update)
    return () => el.removeEventListener("scroll", update)
  }, [ref, update])

  return style
}
