export interface EmailConfig {
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  from: string;
  to: string[];
  subject: string;
}

export interface EmailOptions {
  html: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
} 