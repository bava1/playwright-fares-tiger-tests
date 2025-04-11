import { Reporter, TestCase, TestResult as PlaywrightTestResult, FullResult } from '@playwright/test/reporter';
import { PlaywrightReport } from '../types/types';
import { HTML_REPORT_PATH, JSON_REPORT_PATH, TXT_REPORT_PATH } from '../config/paths';
import { deleteFile, writeFile, initializeReportDirectories } from '../helpers/helper-file-system';
import { generateHtmlReport, generateTextReport } from '../helpers/helper-template';
import { createTestResultsManager, processTestResults, finalizeTestResults } from '../helpers/helper-test-results';
import { TestResultsManager } from '../types/test-results.types';
import { getTimestampedTxtPath } from '../config/get-timestamped-txt-path';

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
      const deleteResult = deleteFile(TXT_REPORT_PATH);
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
      console.log(`Finished test: ${test.title} with status: ${result.status}`);
      const fullResult: FullResult = {
        status: result.status as FullResultStatus,
        startTime: new Date(this.manager.startTime),
        duration: Date.now() - this.manager.startTime
      };
      processTestResults(this.manager, fullResult, test, result);
    } catch (err) {
      console.error('Error in onTestEnd:', err instanceof Error ? err.message : String(err));
    }
  }

  async onEnd(result: FullResult): Promise<void> {
    const timestampedTxtPath = getTimestampedTxtPath();

    try {
      finalizeTestResults(this.manager);

      // Generate text report
      const textReport = generateTextReport({
        summary: this.manager.summary,
        results: this.manager.testResults,
        startTime: this.manager.startTime,
        endTime: Date.now(),
        title: 'Playwright Test Report',
        includeDetails: true,
        includeErrors: true,
        includeScreenshots: true
      });
      // console.log('TXT_REPORT_PATH:', TXT_REPORT_PATH);
      // console.log('Text report preview:\n', textReport.slice(0, 300));
      const textReportResult = writeFile(timestampedTxtPath, textReport);
      if (!textReportResult.success) {
        console.error('Error writing text report:', textReportResult.error);
      }
      // Generate HTML report
      const htmlReport = generateHtmlReport({
        summary: this.manager.summary,
        results: this.manager.testResults,
        startTime: this.manager.startTime,
        endTime: Date.now(),
        title: 'Playwright Test Report'
      });

      const htmlReportResult = writeFile(HTML_REPORT_PATH, htmlReport);
      if (!htmlReportResult.success) {
        console.error('Error writing HTML report:', htmlReportResult.error);
      }

      // Save raw data
      const rawData: PlaywrightReport = {
        config: {
          metadata: {
            platform: process.platform,
            projectName: 'Playwright Tests',
            timestamp: new Date().toISOString()
          }
        },
        suites: Array.from(this.manager.testResults.entries()).map(([id, result]) => ({
          id,
          title: id.split(':')[1] || 'Unknown Test',
          specs: [],
          ...result
        })),
        summary: this.manager.summary
      };

      const rawDataResult = writeFile(JSON_REPORT_PATH, JSON.stringify(rawData, null, 2));
      if (!rawDataResult.success) {
        console.error('Error writing raw data:', rawDataResult.error);
      }

      console.log('Reports generated successfully');
    } catch (err) {
      console.error('Error in onEnd:', err instanceof Error ? err.message : String(err));
    }
  }
}

export default EnhancedReporter;