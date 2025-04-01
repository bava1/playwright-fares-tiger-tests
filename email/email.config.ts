import { EmailConfig } from '../reporters/interfaces/types';

export const emailConfig: EmailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  },
  from: process.env.SMTP_FROM || 'test@example.com',
  to: (process.env.SMTP_TO || 'test@example.com').split(',').map(email => email.trim()),
  subject: process.env.SMTP_SUBJECT || 'Test Report'
}; 