import * as path from 'path';

// Get the project root directory
const PROJECT_ROOT = process.cwd();

// Define paths relative to project root
export const REPORTS_DIR = path.join(PROJECT_ROOT, 'reports');
export const LOGS_DIR = path.join(PROJECT_ROOT, 'logs');
export const SCREENSHOTS_DIR = path.join(PROJECT_ROOT, 'test-results');
export const JSON_REPORT_PATH = path.join(LOGS_DIR, 'json', 'test-report.json');
export const TXT_REPORT_PATH = path.join(LOGS_DIR, 'txt', 'parsed-log.txt');
export const HTML_REPORT_PATH = path.join(PROJECT_ROOT, 'html-report', 'index.html'); 

