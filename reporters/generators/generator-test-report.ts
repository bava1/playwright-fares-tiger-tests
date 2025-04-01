import { Reporter, TestCase, TestResult as PlaywrightTestResult, FullResult } from '@playwright/test/reporter';
import * as path from 'path';
import { TestResultData, TestSummary, PlaywrightReport, TestSuite, TestSpec, TestResult, TestError } from '../interfaces/types';
import { REPORTS_DIR, SCREENSHOTS_DIR, LOG_PATH, PARSED_LOG_PATH, HTML_REPORT_PATH } from '../config/paths';
import { TestStatus } from '../types/emoji.types';
import { createDirectory, deleteFile, writeFile, initializeReportDirectories } from '../helpers/file-system';
import { generateHtmlReport, generateTextReport } from '../helpers/template';
import { createTestResultsManager, processTestResults, finalizeTestResults } from '../helpers/test-results';

/**
 * Enhanced reporter for Playwright that generates text and HTML reports
 */
class EnhancedReporter implements Reporter {
  private manager = createTestResultsManager({
    onError: (error) => console.error('Error in reporter:', error),
    onWarning: (warning) => console.warn('Warning in reporter:', warning),
    onInfo: (info) => console.log('Info from reporter:', info)
  });

  constructor() {
    try {
      // Инициализируем директории для отчетов
      const results = initializeReportDirectories();
      const errors = results.filter(r => !r.success);
      
      if (errors.length > 0) {
        console.error('Error initializing report directories:', errors);
      }

      // Удаляем старый файл parsed-log.txt
      deleteFile(PARSED_LOG_PATH);
    } catch (err) {
      console.error('Error initializing reporter:', err instanceof Error ? err.message : String(err));
    }
  }

  onTestBegin(test: TestCase): void {
    // Можно добавить логику для начала теста, если нужно
  }

  onTestEnd(test: TestCase, result: PlaywrightTestResult): void {
    processTestResults(this.manager, { status: 'passed' } as FullResult, test, result);
  }

  onEnd(result: FullResult): void {
    try {
      finalizeTestResults(this.manager);

      // Generate and save text report
      const textReport = generateTextReport({
        summary: this.manager.summary,
        results: this.manager.testResults,
        startTime: this.manager.startTime,
        endTime: Date.now()
      });
      const textReportResult = writeFile(PARSED_LOG_PATH, textReport);
      if (textReportResult.success) {
        console.log('✅ Text report generated successfully');
      } else {
        console.error('❌ Error saving text report:', textReportResult.error);
      }

      // Generate and save HTML report
      const htmlReport = generateHtmlReport({
        summary: this.manager.summary,
        results: this.manager.testResults,
        startTime: this.manager.startTime,
        endTime: Date.now()
      });
      const htmlReportResult = writeFile(HTML_REPORT_PATH, htmlReport);
      if (htmlReportResult.success) {
        console.log('✅ HTML report generated successfully');
      } else {
        console.error('❌ Error saving HTML report:', htmlReportResult.error);
      }

      // Save raw data
      const rawData: PlaywrightReport = {
        stats: {
          total: this.manager.summary.total,
          passed: this.manager.summary.passed,
          failed: this.manager.summary.failed,
          skipped: this.manager.summary.skipped,
          duration: this.manager.summary.duration
        },
        suites: Array.from(this.manager.testResults.entries()).map(([id, result]) => ({
          id,
          title: id.split(':')[1] || 'Unknown Test',
          specs: [],
          ...result
        }))
      };
      const rawDataResult = writeFile(LOG_PATH, JSON.stringify(rawData, null, 2));
      if (rawDataResult.success) {
        console.log('✅ Raw data saved successfully');
      } else {
        console.error('❌ Error saving raw data:', rawDataResult.error);
      }
    } catch (err) {
      console.error('Error in onEnd:', err instanceof Error ? err.message : String(err));
    }
  }
}

export default EnhancedReporter;