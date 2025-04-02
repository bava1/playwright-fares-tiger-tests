import { Reporter, TestCase, TestResult as PlaywrightTestResult, FullResult } from '@playwright/test/reporter';
import { TestResultData, PlaywrightReport } from '../types/types';
import { PARSED_LOG_PATH, HTML_REPORT_PATH, LOG_PATH } from '../config/paths';
import { createDirectory, deleteFile, writeFile, initializeReportDirectories } from '../helpers/helper-file-system';
import { generateHtmlReport, generateTextReport } from '../helpers/helper-template';
import { createTestResultsManager, processTestResults, finalizeTestResults } from '../helpers/helper-test-results';
import { TestResultsManager } from '../types/test-results.types';

type PlaywrightTestStatus = 'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted';
type FullResultStatus = 'passed' | 'failed' | 'interrupted' | 'timedout';

/**
 * Enhanced reporter for Playwright that generates text and HTML reports
 */
class EnhancedReporter implements Reporter {
  private manager: TestResultsManager;

  constructor() {
    this.manager = createTestResultsManager({
      onError: (error) => console.error('Error in reporter:', error),
      onWarning: (warning) => console.warn('Warning in reporter:', warning),
      onInfo: (info) => console.log('Info from reporter:', info)
    });

    try {
      // Initialize report directories
      const results = initializeReportDirectories();
      const errors = results.filter(r => !r.success);
      
      if (errors.length > 0) {
        console.error('Error initializing report directories:', errors);
      }

      // Delete old parsed-log.txt file
      const deleteResult = deleteFile(PARSED_LOG_PATH);
      if (!deleteResult.success) {
        console.warn('Could not delete old parsed log file:', deleteResult.error);
      }
    } catch (err) {
      console.error('Error initializing reporter:', err instanceof Error ? err.message : String(err));
    }
  }

  onTestBegin(test: TestCase): void {
    try {
      console.log(`Starting test: ${test.title}`);
    } catch (err) {
      console.error('Error in onTestBegin:', err instanceof Error ? err.message : String(err));
    }
  }

  onTestEnd(test: TestCase, result: PlaywrightTestResult): void {
    try {
      // Convert test status to match FullResult status type
      let status: FullResultStatus;
      switch (result.status as PlaywrightTestStatus) {
        case 'passed':
          status = 'passed';
          break;
        case 'timedOut':
          status = 'timedout';
          break;
        case 'interrupted':
          status = 'interrupted';
          break;
        case 'failed':
        case 'skipped':
        default:
          status = 'failed';
          break;
      }

      const fullResult: FullResult = {
        status,
        startTime: new Date(this.manager.startTime),
        duration: Date.now() - this.manager.startTime
      };
      processTestResults(this.manager, fullResult, test, result);
    } catch (err) {
      console.error('Error in onTestEnd:', err instanceof Error ? err.message : String(err));
    }
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