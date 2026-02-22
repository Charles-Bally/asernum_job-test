export function randomDelay(): Promise<void> {
  if (process.env.NODE_ENV !== "development") return Promise.resolve()
  const ms = Math.floor(Math.random() * 300) + 200
  return new Promise((resolve) => setTimeout(resolve, ms))
}
