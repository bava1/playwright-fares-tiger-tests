import { TextCleanerOptions, CleanedText } from '../types/text-cleaner.types';

/**
 * Удаляет ANSI escape-последовательности из текста
 */
export const stripAnsiCodes = (str: string): string => {
  return str.replace(/\u001b\[\d+m/g, '');
};

/**
 * Удаляет специальные символы форматирования Playwright
 */
export const removeFormatting = (str: string): string => {
  return str.replace(/\[2m|\[22m|\[31m|\[39m|\[\d+m/g, '');
};

/**
 * Экранирует HTML-специальные символы
 */
export const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Очищает текст от специальных символов и форматирования
 */
export const cleanText = (text: string, options: TextCleanerOptions = {}): CleanedText => {
  let cleaned = text;

  if (options.removeAnsiCodes) {
    cleaned = stripAnsiCodes(cleaned);
  }

  if (options.removeFormatting) {
    cleaned = removeFormatting(cleaned);
  }

  if (options.escapeHtml) {
    cleaned = escapeHtml(cleaned);
  }

  return {
    original: text,
    cleaned: cleaned.trim()
  };
};

/**
 * Очищает сообщение об ошибке от специальных символов
 */
export const cleanErrorMessage = (message: string): string => {
  return cleanText(message, {
    removeAnsiCodes: true,
    removeFormatting: true,
    escapeHtml: true
  }).cleaned;
}; 