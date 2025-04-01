import { htmlTemplate } from '../html-templates/html-template';
import { getStatusEmoji } from './emoji';
import { cleanErrorMessage } from './text-cleaner';
import { TemplateOptions, TextTemplateOptions } from '../types/template.types';
import { TestStatus } from '../types/emoji.types';
import { TestResultData } from '../interfaces/types';

/**
 * Генерирует HTML отчет на основе шаблона
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
    error?: { message?: string; stack?: string };
    screenshot?: string;
    statusEmoji?: string;
  }>();

  // Группируем тесты по категориям
  results.forEach((result: TestResultData, id: string) => {
    const [category, testName] = id.split(':');
    if (!testCategories.has(category)) {
      testCategories.set(category, []);
    }
    testCategories.get(category)?.push(testName);

    // Добавляем результат теста с эмодзи для HTML
    testResults.set(id, {
      status: result.status,
      duration: result.duration,
      error: result.error,
      screenshot: result.screenshot,
      statusEmoji: getStatusEmoji(result.status as TestStatus)
    });
  });

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
 * Генерирует текстовый отчет
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
  let report = '';

  // Добавляем заголовок
  report += 'Playwright Test Report\n';
  report += '═'.repeat(80) + '\n\n';

  // Добавляем общую статистику
  report += `Total Tests: ${summary.total}\n`;
  report += `Passed: ${summary.passed}\n`;
  report += `Failed: ${summary.failed}\n`;
  report += `Skipped: ${summary.skipped}\n`;
  report += `Duration: ${duration}ms\n\n`;

  // Добавляем детали по каждому тесту
  if (includeDetails) {
    report += 'Test Details\n';
    report += '═'.repeat(80) + '\n\n';

    // Группируем тесты по категориям
    const categories = new Map<string, Array<{ id: string; result: any }>>();
    results.forEach((result, id) => {
      const [category] = id.split(':');
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)?.push({ id, result });
    });

    // Выводим тесты по категориям
    categories.forEach((tests, category) => {
      report += `📁 ${category}\n`;
      report += '─'.repeat(80) + '\n\n';

      tests.forEach(({ id, result }) => {
        const testName = id.split(':')[1] || 'Unknown Test';
        const status = getStatusEmoji(result.status as TestStatus);
        
        report += `${status} ${testName}\n`;
        report += `Status: ${result.status}\n`;
        report += `Duration: ${result.duration}ms\n`;

        if (includeErrors && result.error) {
          report += cleanErrorMessage(result.error.message);
          report += '\n';
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