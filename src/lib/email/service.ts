import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { emailConfig, isEmailConfigured } from './config';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    path?: string;
    contentType?: string;
  }>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

let transporter: Transporter | null = null;

/**
 * Get or create the email transporter
 */
function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass,
      },
    });
  }
  return transporter;
}

/**
 * Verify SMTP connection
 */
export async function verifyConnection(): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.error('Email not configured: missing SMTP credentials');
    return false;
  }

  try {
    await getTransporter().verify();
    return true;
  } catch (error) {
    console.error('SMTP connection failed:', error);
    return false;
  }
}

/**
 * Send an email
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  if (!isEmailConfigured()) {
    return {
      success: false,
      error: 'Email not configured: missing SMTP credentials',
    };
  }

  try {
    const mailOptions = {
      from: {
        name: emailConfig.from.name,
        address: emailConfig.from.address,
      },
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      replyTo: options.replyTo,
      cc: options.cc,
      bcc: options.bcc,
      attachments: options.attachments,
    };

    const info = await getTransporter().sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to send email:', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Send a simple text email
 */
export async function sendTextEmail(
  to: string | string[],
  subject: string,
  text: string
): Promise<EmailResult> {
  return sendEmail({ to, subject, text });
}

/**
 * Send an HTML email
 */
export async function sendHtmlEmail(
  to: string | string[],
  subject: string,
  html: string,
  text?: string
): Promise<EmailResult> {
  return sendEmail({ to, subject, html, text });
}
