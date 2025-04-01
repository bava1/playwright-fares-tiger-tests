import { TestCase, TestResult as PlaywrightTestResult, FullResult } from '@playwright/test/reporter';
import { TestResultData, TestSummary, TestError } from '../interfaces/types';
import { TestStatus } from '../types/emoji.types';
import { TestResultsManager, TestResultProcessor, TestResultsOptions } from '../types/test-results.types';

/**
 * Создает менеджер тестовых результатов
 */
export function createTestResultsManager(options: TestResultsOptions = {}): TestResultsManager {
  return {
    startTime: Date.now(),
    results: new Map<string, PlaywrightTestResult>(),
    testCases: new Map<string, TestCase>(),
    testCategories: new Map<string, string[]>(),
    testResults: new Map<string, TestResultData>(),
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: 0
    },
    hasEnded: false
  };
}

/**
 * Создает процессор тестовых результатов
 */
export function createTestResultProcessor(manager: TestResultsManager): TestResultProcessor {
  return {
    processTestResult(result: PlaywrightTestResult, testCase: TestCase): TestResultData {
      const testId = `${testCase.parent.title}:${testCase.title}`;
      const testResult: TestResultData = {
        status: result.status as TestStatus,
        duration: result.duration,
        error: result.error ? {
          message: result.error.message || 'Unknown error',
          stack: result.error.stack
        } : undefined,
        retry: result.retry,
        screenshot: result.attachments?.find(a => a.contentType === 'image/png')?.path
      };

      manager.results.set(testId, result);
      manager.testCases.set(testId, testCase);
      manager.testResults.set(testId, testResult);

      return testResult;
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

    updateTestCategories(testCase: TestCase): void {
      const category = testCase.parent.title;
      if (!manager.testCategories.has(category)) {
        manager.testCategories.set(category, []);
      }
      manager.testCategories.get(category)?.push(testCase.title);
    }
  };
}

/**
 * Обрабатывает результаты тестов
 */
export function processTestResults(
  manager: TestResultsManager,
  result: FullResult,
  testCase: TestCase,
  testResult: PlaywrightTestResult
): void {
  const processor = createTestResultProcessor(manager);
  const processedResult = processor.processTestResult(testResult, testCase);
  processor.updateSummary(processedResult);
  processor.updateTestCategories(testCase);
}

/**
 * Завершает обработку результатов тестов
 */
export function finalizeTestResults(manager: TestResultsManager): void {
  manager.hasEnded = true;
  manager.summary.duration = Date.now() - manager.startTime;
} 