import { htmlTemplate } from '../html-templates/html-template';
import { getStatusEmoji } from './helper-text-utils';
import { cleanErrorMessage } from './helper-text-utils';
import { TemplateOptions, TextTemplateOptions } from '../types/types';
import { TestStatus } from '../types/types';
import { TestResultData } from '../types/types';

/**
 * Generates an HTML report from test results
 * @param options Report generation options
 * @returns HTML string
 */
export function generateHtmlReport(options: TemplateOptions): string {
  const { results, summary, title = 'Test Report', timestamp = new Date().toISOString() } = options;

  const duration = options.endTime - options.startTime;
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
      flaky: summary.flaky,
      duration

    },
    testCategories,
    testResults
  );
}

/**
 * Generates a text report from test results
 * @param options Report generation options
 * @returns Text string
 */
export function generateTextReport(options: TextTemplateOptions): string {
  const { results, summary, title = 'Test Report', timestamp = new Date().toISOString() } = options;

  const duration = options.endTime - options.startTime;
  let report = `${title}\n`;
  report += `Generated on: ${new Date().toLocaleString()}\n\n`;
  report += `Summary:\n`;
  report += `Total: ${summary.total}\n`;
  report += `Passed: ${summary.passed}\n`;
  report += `Failed: ${summary.failed}\n`;
  report += `Flaky: ${summary.flaky}\n`;
  report += `Skipped: ${summary.skipped}\n`;
  report += `Duration: ${(duration / 1000).toFixed(2)}s\n\n`;

  if (options.includeDetails) {
    report += 'Test Details\n';
    report += '═'.repeat(80) + '\n\n';

    const categories = new Map<string, Array<{ id: string; result: TestResultData }>>();
    for (const [testId, result] of results.entries()) {
      const [category] = testId.split(':');
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)?.push({ id: testId, result });
    }

    categories.forEach((tests, category) => {
      report += `📁 ${category}\n`;
      report += '─'.repeat(80) + '\n\n';

      tests.forEach(({ id, result }) => {
        const testName = id.split(':')[1] || 'Unknown Test';
        const status = getStatusEmoji(result.status as TestStatus);

        report += `${status} ${testName}\n`;
        report += `Status: ${result.status}\n`;

        // 💡 Добавляем информацию для flaky
        if (result.status === 'flaky') {
          report += `Flaky: true\n`;
          report += `Retry Count: ${result.retry ?? 1}\n`;
        }

        report += `Duration: ${(result.duration / 1000).toFixed(2)}s\n`;

        if (options.includeErrors && result.error) {
          report += `Error: ${cleanErrorMessage(result.error.message || 'Unknown error')}\n`;
        }

        if (options.includeScreenshots && result.screenshot) {
          report += 'Screenshot:\n';
          report += `- ${result.screenshot}\n`;
        }

        report += '\n' + '─'.repeat(80) + '\n\n';
      });
    });
  }

  return report;
}
