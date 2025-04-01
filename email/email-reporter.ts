import nodemailer from 'nodemailer';
import { promises as fs } from 'fs';
import path from 'path';
import process from 'process';
import { EmailConfig } from '../reporters/interfaces/types';


/**
 * Class for sending reports via email
 */
export class EmailReporter {
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
  }

  /**
   * Sends report via email
   * @param reportDirPath Path to the reports directory
   * @param additionalText Additional text to include in the message
   */
  async sendReportEmail(reportDirPath: string, additionalText?: string): Promise<void> {
    try {
      // Create email transport
      const transporter = nodemailer.createTransport({
        host: this.config.host,
        port: this.config.port,
        secure: this.config.secure,
        auth: {
          user: this.config.auth.user,
          pass: this.config.auth.pass,
        },
      });

      // Check for reports
      const htmlReportPath = path.join(reportDirPath, 'report.html');
      const textReportPath = path.join(reportDirPath, 'report.txt');
      
      let htmlReport: string | undefined;
      let textReport: string | undefined;
      
      try {
        htmlReport = await fs.readFile(htmlReportPath, 'utf-8');
      } catch (error) {
        console.error('Error reading HTML report:', error);
      }
      
      try {
        textReport = await fs.readFile(textReportPath, 'utf-8');
      } catch (error) {
        console.error('Error reading text report:', error);
      }
      
      if (!htmlReport && !textReport) {
        throw new Error('No reports found for sending');
      }

      // Collect attachments - screenshots
      const attachments: { filename: string; path: string; cid: string }[] = [];
      const screenshotsDir = path.join(process.cwd(), 'test-results');
      
      try {
        // Check if screenshots directory exists
        await fs.access(screenshotsDir);
        
        // Get all files in directory
        const files = await fs.readdir(screenshotsDir, { withFileTypes: true });
        
        // Filter only PNG files
        const pngFiles = files
          .filter(file => file.isFile() && file.name.endsWith('.png'))
          .map(file => file.name);
        
        // Add each screenshot as attachment
        for (let i = 0; i < Math.min(pngFiles.length, 10); i++) { // Limit number of attachments
          const fileName = pngFiles[i];
          const filePath = path.join(screenshotsDir, fileName);
          attachments.push({
            filename: fileName,
            path: filePath,
            cid: `screenshot_${i}` // This allows referencing the image in HTML via cid
          });
        }
      } catch (error) {
        console.error('Error working with screenshots:', error);
      }

      // Format message text
      let emailText = `
        Tour Booking Web Service Test Report
        Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
        
        ${additionalText || ''}
        
        ${textReport || 'Text report is not available'}
      `;

      // Send email
      await transporter.sendMail({
        from: this.config.from,
        to: this.config.to.join(', '),
        subject: this.config.subject,
        text: emailText,
        html: htmlReport || '<p>HTML report is not available</p>',
        attachments: attachments,
      });

      console.log('✅ Report successfully sent via email');
    } catch (error) {
      console.error('❌ Error sending report via email:', error);
      throw error;
    }
  }
}

/**
 * Creates and returns an EmailReporter instance with configuration from environment variables or file
 */
export async function createEmailReporter(): Promise<EmailReporter> {
  // By default, try to get configuration from environment variables
  const config: EmailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASS || '',
    },
    from: process.env.EMAIL_FROM || 'automated-tests@example.com',
    to: (process.env.EMAIL_TO || '').split(',').map(email => email.trim()),
    subject: process.env.EMAIL_SUBJECT || 'Tour Booking Web Service Test Report',
  };

  // If not all required environment variables are set, try to read from file
  if (!config.auth.user || !config.auth.pass || config.to.length === 0) {
    try {
      const configFilePath = path.join(process.cwd(), 'email-config.json');
      const configData = await fs.readFile(configFilePath, 'utf-8');
      const fileConfig = JSON.parse(configData);
      
      // Merge configurations, preferring environment variables
      config.host = process.env.EMAIL_HOST || fileConfig.host || config.host;
      config.port = parseInt(process.env.EMAIL_PORT || fileConfig.port || config.port, 10);
      config.secure = process.env.EMAIL_SECURE ? process.env.EMAIL_SECURE === 'true' : (fileConfig.secure || config.secure);
      config.auth.user = process.env.EMAIL_USER || fileConfig.auth?.user || config.auth.user;
      config.auth.pass = process.env.EMAIL_PASS || fileConfig.auth?.pass || config.auth.pass;
      config.from = process.env.EMAIL_FROM || fileConfig.from || config.from;
      config.to = process.env.EMAIL_TO ? 
        process.env.EMAIL_TO.split(',').map(email => email.trim()) : 
        (fileConfig.to || config.to);
      config.subject = process.env.EMAIL_SUBJECT || fileConfig.subject || config.subject;
    } catch (error) {
      console.warn('⚠️ Failed to load email configuration from file. Using default parameters.');
    }
  }

  // Return EmailReporter instance with configured settings
  return new EmailReporter(config);
} 