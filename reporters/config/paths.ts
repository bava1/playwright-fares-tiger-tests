import * as path from 'path';

export const REPORTS_DIR = path.resolve(process.cwd(), 'reports');
export const SCREENSHOTS_DIR = path.resolve(process.cwd(), 'test-results');
export const LOG_PATH = path.join(process.cwd(), 'logs', 'test-report.json');
export const PARSED_LOG_PATH = path.join(path.dirname(LOG_PATH), 'parsed-log.txt');
export const HTML_REPORT_PATH = path.join(process.cwd(), 'html-report', 'index.html'); 