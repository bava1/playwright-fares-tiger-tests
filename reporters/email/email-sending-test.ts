import { EmailService } from './email-service';
import { loadEmailConfig } from './email-config';
import { EmailConfig } from './email-types';

const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`[INFO] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
}; 

const TEST_CONFIG: EmailConfig = {
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  },
  from: process.env.EMAIL_FROM || 'test@example.com',
  to: (process.env.EMAIL_TO || 'test@example.com').split(','),
  subject: 'Test Email from Playwright Tests',
};

async function sendTestEmail(): Promise<void> {
  let emailService: EmailService | null = null;
  
  try {
    logger.info('Starting email sending test...');
    
    // Load configuration
    const config = await loadEmailConfig();
    
    // Create email service instance
    emailService = new EmailService(config);

    // Initialize and verify connection
    await emailService.initialize();

    // Prepare test email content
    const testContent = {
      html: `
        <h2>Test Email</h2>
        <p>This is a test email sent from the Playwright test suite.</p>
        <p>Time: ${new Date().toISOString()}</p>
      `,
    };

    // Send test email with retry
    logger.info('Attempting to send test email...');
    const result = await emailService.sendEmailWithRetry(testContent);

    if (result.success) {
      logger.info('Test email sent successfully');
      logger.info(`Message ID: ${result.messageId}`);
    } else {
      throw new Error(`Failed to send email: ${result.error}`);
    }
  } catch (error) {
    logger.error('Error during email test:', error);
    throw error;
  } finally {
    // Cleanup in finally block to ensure it runs even if there's an error
    if (emailService) {
      try {
        await emailService.cleanup();
      } catch (error) {
        logger.error('Error during cleanup:', error);
      }
    }
  }
}

export { sendTestEmail }; 