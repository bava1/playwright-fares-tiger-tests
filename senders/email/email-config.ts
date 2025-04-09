import { EmailConfig } from './email-types';

const DEFAULT_CONFIG: EmailConfig = {
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: '',
      pass: '',
    },
  },
  from: '',
  to: [],
  subject: 'Playwright Test Report',
};

export async function loadEmailConfig(): Promise<EmailConfig> {
  const config: EmailConfig = {
    smtp: {
      host: process.env.SMTP_HOST || DEFAULT_CONFIG.smtp.host,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : DEFAULT_CONFIG.smtp.port,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || DEFAULT_CONFIG.smtp.auth.user,
        pass: process.env.SMTP_PASS || DEFAULT_CONFIG.smtp.auth.pass,
      },
    },
    from: process.env.EMAIL_FROM || DEFAULT_CONFIG.from,
    to: process.env.EMAIL_TO ? process.env.EMAIL_TO.split(',') : DEFAULT_CONFIG.to,
    subject: process.env.EMAIL_SUBJECT || DEFAULT_CONFIG.subject,
  };

  const errors = validateConfig(config);
  if (errors.length > 0) {
    throw new Error(`Invalid email configuration: ${errors.join(', ')}`);
  }

  return config;
}

export function validateConfig(config: EmailConfig): string[] {
  const errors: string[] = [];

  if (!config.smtp.host) errors.push('SMTP host is required');
  if (!config.smtp.port) errors.push('SMTP port is required');
  if (!config.smtp.auth.user) errors.push('SMTP username is required');
  if (!config.smtp.auth.pass) errors.push('SMTP password is required');
  if (!config.from) errors.push('Sender email is required');
  if (!config.to.length) errors.push('At least one recipient is required');
  if (!config.subject) errors.push('Email subject is required');

  return errors;
} 