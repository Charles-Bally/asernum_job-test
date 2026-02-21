export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { bootstrapService } = await import(
      "@/services/api/bootstrap.service"
    )
    await bootstrapService.run()
  }
}
