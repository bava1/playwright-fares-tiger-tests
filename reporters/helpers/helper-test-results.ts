import { TestCase, TestResult as PlaywrightTestResult, FullResult } from '@playwright/test/reporter';
import { TestResultData, TestSummary, TestError } from '../types/types';
import { TestStatus } from '../types/types';
import { TestResultsManager, TestResultProcessor, TestResultsOptions } from '../types/test-results.types';

interface ExtendedTestResult extends PlaywrightTestResult {
  screenshot?: string;
}

/**
 * Creates a test results manager
 * @param callbacks Callback functions for error handling and logging
 * @returns Test results manager
 */
export function createTestResultsManager(callbacks: {
  onError: (error: Error) => void;
  onWarning: (warning: string) => void;
  onInfo: (info: string) => void;
}): TestResultsManager {
  return {
    startTime: Date.now(),
    hasEnded: false,
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0
    },
    results: new Map(),
    testCases: new Map(),
    testResults: new Map(),
    testCategories: new Map()
  };
}

/**
 * Creates a test results processor
 * @param manager Test results manager
 * @returns Test results processor
 */
function createTestResultProcessor(manager: TestResultsManager): TestResultProcessor {
  return {
    processTestResult(testResult: ExtendedTestResult, test: TestCase): TestResultData {
      const testId = `${test.parent.title}:${test.title}`;
      const result: TestResultData = {
        status: testResult.status as TestStatus,
        duration: testResult.duration,
        error: testResult.error ? {
          message: testResult.error.message,
          stack: testResult.error.stack
        } : undefined,
        retry: testResult.retry,
        screenshot: testResult.screenshot
      };

      manager.results.set(testId, testResult);
      manager.testCases.set(testId, test);
      manager.testResults.set(testId, result);

      return result;
    },
    updateSummary(result: TestResultData): void {
      manager.summary.total++;
      switch (result.status) {
        case 'passed':
          manager.summary.passed++;
          break;
        case 'failed':
          manager.summary.failed++;
          break;
        case 'skipped':
          manager.summary.skipped++;
          break;
        case 'timedOut':
        case 'interrupted':
        case 'unknown':
          manager.summary.failed++;
          break;
      }
    },
    updateTestCategories(test: TestCase): void {
      const category = test.parent.title;
      if (!manager.testCategories.has(category)) {
        manager.testCategories.set(category, []);
      }
      manager.testCategories.get(category)?.push(test.title);
    }
  };
}

/**
 * Processes test results
 * @param manager Test results manager
 * @param result Full test result
 * @param test Test case
 * @param testResult Test result
 */
export function processTestResults(
  manager: TestResultsManager,
  result: FullResult,
  test: TestCase,
  testResult: PlaywrightTestResult
): void {
  const processor = createTestResultProcessor(manager);
  const processedResult = processor.processTestResult(testResult, test);
  processor.updateSummary(processedResult);
  processor.updateTestCategories(test);
}

/**
 * Finalizes test results processing
 * @param manager Test results manager
 */
export function finalizeTestResults(manager: TestResultsManager): void {
  manager.hasEnded = true;
  manager.summary.duration = Date.now() - manager.startTime;
} 