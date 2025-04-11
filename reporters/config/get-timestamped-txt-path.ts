import * as path from 'path';
import { LOGS_DIR } from './paths';

/**
 * Generates a timestamped TXT report path in human-readable format
 * Format: parsed-log_YYYY-MM-DD_HH-MM-SS.txt
 * @returns Full path to a unique txt report file
 */
export function getTimestampedTxtPath(): string {
    const now = new Date();
  
    const pad = (n: number) => n.toString().padStart(2, '0');
  
    const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const time = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  
    const fileName = `parsed-log_${date}_${time}.txt`;
  
    return path.join(LOGS_DIR, 'txt', fileName);
}