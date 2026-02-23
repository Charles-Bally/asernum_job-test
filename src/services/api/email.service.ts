import { BrevoClient } from "@getbrevo/brevo"
import ejs from "ejs"
import path from "path"

const BREVO_API_KEY = process.env.BREVO_API_KEY!
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "noreply@charlesbally.com"
const SENDER_NAME = process.env.BREVO_SENDER_NAME || "Asernum Job"

type SendEmailParams = {
  to: string
  subject: string
  templateName: string
  data: Record<string, any>
}

async function renderTemplate(templateName: string, data: Record<string, any>): Promise<string> {
  const templatePath = path.join(process.cwd(), "src", "templates", "email", `${templateName}.ejs`)
  return ejs.renderFile(templatePath, data)
}

async function sendEmail({ to, subject, templateName, data }: SendEmailParams): Promise<void> {
  if (!BREVO_API_KEY || !SENDER_EMAIL || !SENDER_NAME) {
    console.error("BREVO_API_KEY, BREVO_SENDER_EMAIL or BREVO_SENDER_NAME is not set")
    return
  }
  const htmlContent = await renderTemplate(templateName, data)

  const client = new BrevoClient({ apiKey: BREVO_API_KEY })

  await client.transactionalEmails.sendTransacEmail({
    subject,
    htmlContent,
    sender: { name: SENDER_NAME, email: SENDER_EMAIL },
    to: [{ email: to }],
  })
}

export const emailService = { sendEmail, renderTemplate }
