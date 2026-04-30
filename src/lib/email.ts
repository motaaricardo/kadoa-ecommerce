import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASSWORD;
const secure = (process.env.SMTP_SECURE ?? 'true') === 'true';
const from = process.env.SMTP_FROM ?? 'Kadoa <info@kadoa.ch>';

export const isEmailConfigured = Boolean(host && user && pass);

const transporter = isEmailConfigured
  ? nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user: user!, pass: pass! },
    })
  : null;

export type MailPayload = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export async function sendMail({ to, subject, html, text, replyTo }: MailPayload) {
  if (!transporter) {
    // No SMTP configured — log to console so dev can still see what would have been sent.
    console.log('[email] SMTP not configured — would have sent:');
    console.log({ to, subject, replyTo });
    return { ok: false, reason: 'smtp_not_configured' as const };
  }
  const info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
    text: text ?? html.replace(/<[^>]+>/g, ''),
    replyTo,
  });
  return { ok: true, id: info.messageId };
}
