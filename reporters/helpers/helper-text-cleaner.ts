import { TextCleanerOptions, CleanedText } from '../types/text-cleaner.types';

/**
 * Removes ANSI escape sequences from text
 * @param text Text to clean
 * @returns Cleaned text
 */
export function cleanAnsiCodes(text: string): string {
  return text.replace(/\u001B\[\d+m/g, '');
}

/**
 * Removes Playwright formatting special characters
 * @param text Text to clean
 * @returns Cleaned text
 */
export function cleanPlaywrightFormatting(text: string): string {
  return text.replace(/[\u001B\u009B][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
}

/**
 * Escapes HTML special characters
 * @param text Text to escape
 * @returns Escaped text
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Cleans error message for display
 * @param message Error message to clean
 * @returns Cleaned error message
 */
export function cleanErrorMessage(message: string): string {
  return escapeHtml(cleanPlaywrightFormatting(cleanAnsiCodes(message)));
}

/**
 * Cleans text from special characters and formatting
 * @param text Text to clean
 * @param options Cleaning options
 * @returns Object containing original and cleaned text
 */
export const cleanText = (text: string, options: TextCleanerOptions = {}): CleanedText => {
  let cleaned = text;

  if (options.removeAnsiCodes) {
    cleaned = cleanAnsiCodes(cleaned);
  }

  if (options.removeFormatting) {
    cleaned = cleanPlaywrightFormatting(cleaned);
  }

  if (options.escapeHtml) {
    cleaned = escapeHtml(cleaned);
  }

  return {
    original: text,
    cleaned: cleaned.trim()
  };
}; 