import { EmojiMap, TestStatus } from '../types/types';

const DEFAULT_EMOJI_SET: EmojiMap = {
  passed: '✅',
  failed: '❌',
  skipped: '⏭️',
  timedOut: '⏰',
  interrupted: '⚠️',
  unknown: '❓'
};

export function getStatusEmoji(status: TestStatus): string {
  return DEFAULT_EMOJI_SET[status] || DEFAULT_EMOJI_SET.unknown;
}

export function cleanAnsiCodes(text: string): string {
  // Remove ANSI escape codes
  return text.replace(/\u001b\[\d+m/g, '');
}

export function cleanPlaywrightFormatting(text: string): string {
  // Remove Playwright-specific formatting
  return text
    .replace(/\[0m/g, '') // Reset
    .replace(/\[2m/g, '') // Dim
    .replace(/\[1m/g, '') // Bold
    .replace(/\[32m/g, '') // Green
    .replace(/\[31m/g, '') // Red
    .replace(/\[33m/g, '') // Yellow
    .replace(/\[90m/g, ''); // Gray
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function cleanErrorMessage(message: string): string {
  if (!message) return '';
  
  // First clean any ANSI codes and Playwright formatting
  let cleaned = cleanAnsiCodes(message);
  cleaned = cleanPlaywrightFormatting(cleaned);
  
  // Remove stack traces
  cleaned = cleaned.split('\n')[0];
  
  // Remove common prefixes
  cleaned = cleaned
    .replace(/Error: /g, '')
    .replace(/AssertionError: /g, '')
    .replace(/TimeoutError: /g, '');
  
  return cleaned.trim();
} 