import nodemailer from 'nodemailer';
import { EmailConfig, EmailOptions, EmailResult } from './email-types';

interface RetryOptions {
  maxAttempts: number;
  delayMs: number;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  delayMs: 1000, // 1 second
};

export class EmailService {
  private transporter: nodemailer.Transporter;
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: config.smtp.auth,
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 5000,    // 5 seconds
      socketTimeout: 10000,     // 10 seconds
    });
  }

  async initialize(): Promise<void> {
    try {
      await this.transporter.verify();
      console.log('✅ SMTP connection verified successfully');
    } catch (error) {
      console.error('❌ Failed to verify SMTP connection:', error);
      throw new Error(`SMTP connection verification failed: ${error}`);
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async sendEmailWithRetry(
    options: EmailOptions,
    retryOptions: RetryOptions = DEFAULT_RETRY_OPTIONS
  ): Promise<EmailResult> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retryOptions.maxAttempts; attempt++) {
      try {
        const result = await this.sendEmail(options);
        if (result.success) {
          return result;
        }
        lastError = new Error(result.error || 'Unknown error occurred');
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }

      if (attempt < retryOptions.maxAttempts) {
        console.log(`Attempt ${attempt} failed, retrying in ${retryOptions.delayMs}ms...`);
        await this.delay(retryOptions.delayMs);
      }
    }

    return {
      success: false,
      error: lastError?.message || 'All retry attempts failed',
    };
  }

  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    try {
      const info = await this.transporter.sendMail({
        from: this.config.from,
        to: this.config.to.join(','),
        subject: this.config.subject,
        html: options.html,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async cleanup(): Promise<void> {
    try {
      await this.transporter.close();
      console.log('SMTP connection closed successfully');
    } catch (error) {
      console.error('Error closing SMTP connection:', error);
      throw error;
    }
  }
} 