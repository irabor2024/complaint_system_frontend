import nodemailer from 'nodemailer';
import { env, isMailConfigured } from './env';
import { logger } from './logger';

export function createMailTransport() {
  if (!isMailConfigured || !env.MAIL_HOST) {
    return null;
  }
  return nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: env.MAIL_PORT ?? 587,
    secure: env.MAIL_SECURE ?? false,
    auth:
      env.MAIL_USER && env.MAIL_PASS
        ? { user: env.MAIL_USER, pass: env.MAIL_PASS }
        : undefined,
  });
}

export async function sendMailSafe(options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<void> {
  const transport = createMailTransport();
  if (!transport) {
    logger.info({ mail: options }, 'Email skipped (SMTP not configured)');
    return;
  }
  try {
    await transport.sendMail({
      from: env.MAIL_FROM,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
  } catch (err) {
    logger.error({ err, to: options.to }, 'Failed to send email');
  }
}
