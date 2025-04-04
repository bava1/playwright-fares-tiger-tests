import * as path from 'path';

// Get the project root directory
const PROJECT_ROOT = process.cwd();

// Define paths relative to project root
export const REPORTS_DIR = path.join(PROJECT_ROOT, 'reports');
export const SCREENSHOTS_DIR = path.join(PROJECT_ROOT, 'test-results');
export const LOG_PATH = path.join(PROJECT_ROOT, 'logs', 'test-report.json');
export const PARSED_LOG_PATH = path.join(path.dirname(LOG_PATH), 'parsed-log.txt');
export const HTML_REPORT_PATH = path.join(PROJECT_ROOT, 'html-report', 'index.html'); 