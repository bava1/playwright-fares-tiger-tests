export interface TextCleanerOptions {
  removeAnsiCodes?: boolean;
  removeFormatting?: boolean;
  escapeHtml?: boolean;
}

export interface CleanedText {
  original: string;
  cleaned: string;
} 