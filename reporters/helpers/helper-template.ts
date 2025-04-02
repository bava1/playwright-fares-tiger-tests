import { htmlTemplate } from '../html-templates/html-template';
import { getStatusEmoji } from './helper-emoji';
import { cleanErrorMessage } from './helper-text-cleaner';
import { TemplateOptions, TextTemplateOptions } from '../types/template.types';
import { TestStatus } from '../types/emoji.types';
import { TestResultData } from '../types/types';

/**
 * Generates HTML report based on template
 * @param options Template options
 * @returns HTML report
 */
export function generateHtmlReport(options: TemplateOptions): string {
  const {
    summary,
    results,
    startTime,
    endTime,
    title = 'Playwright Test Report',
    theme = 'light'
  } = options;

  const duration = endTime - startTime;
  const testCategories = new Map<string, string[]>();
  const testResults = new Map<string, {
    status: string;
    duration: number;
    error?: {
      message?: string;
      stack?: string;
    };
    screenshot?: string;
    statusEmoji?: string;
  }>();

  // Group tests by categories
  for (const [testId, result] of results.entries()) {
    const [category, testName] = testId.split(':');
    if (!testCategories.has(category)) {
      testCategories.set(category, []);
    }
    testCategories.get(category)?.push(testName);

    // Add test result with emoji for HTML
    testResults.set(testId, {
      status: result.status,
      duration: result.duration,
      error: result.error,
      screenshot: result.screenshot,
      statusEmoji: getStatusEmoji(result.status as TestStatus)
    });
  }

  return htmlTemplate(
    {
      passed: summary.passed,
      failed: summary.failed,
      skipped: summary.skipped,
      duration
    },
    testCategories,
    testResults
  );
}

/**
 * Generates text report
 * @param options Text template options
 * @returns Text report
 */
export function generateTextReport(options: TextTemplateOptions): string {
  const {
    summary,
    results,
    startTime,
    endTime,
    includeDetails = true,
    includeErrors = true,
    includeScreenshots = true
  } = options;

  const duration = endTime - startTime;
  let report = 'Test Report\n';
  report += `Generated on: ${new Date().toLocaleString()}\n\n`;
  report += `Summary:\n`;
  report += `Total: ${summary.total}\n`;
  report += `Passed: ${summary.passed}\n`;
  report += `Failed: ${summary.failed}\n`;
  report += `Skipped: ${summary.skipped}\n`;
  report += `Duration: ${(duration / 1000).toFixed(2)}s\n\n`;

  if (includeDetails) {
    report += 'Test Details\n';
    report += '═'.repeat(80) + '\n\n';

    // Group tests by categories
    const categories = new Map<string, Array<{ id: string; result: any }>>();
    for (const [testId, result] of results.entries()) {
      const [category] = testId.split(':');
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)?.push({ id: testId, result });
    }

    // Output tests by categories
    categories.forEach((tests, category) => {
      report += `📁 ${category}\n`;
      report += '─'.repeat(80) + '\n\n';

      tests.forEach(({ id, result }) => {
        const testName = id.split(':')[1] || 'Unknown Test';
        const status = getStatusEmoji(result.status as TestStatus);
        
        report += `${status} ${testName}\n`;
        report += `Status: ${result.status}\n`;
        report += `Duration: ${(result.duration / 1000).toFixed(2)}s\n`;

        if (includeErrors && result.error) {
          report += `Error: ${cleanErrorMessage(result.error.message || 'Unknown error')}\n`;
        }

        if (includeScreenshots && result.screenshot) {
          report += 'Screenshot:\n';
          report += `- ${result.screenshot}\n`;
        }

        report += '\n' + '─'.repeat(80) + '\n\n';
      });
    });
  }

  return report;
} 