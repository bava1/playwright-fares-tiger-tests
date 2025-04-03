import { TestCase, TestResult as PlaywrightTestResult } from '@playwright/test/reporter';
import { TestResultData, TestSummary } from '../types/types';

export interface TestResultsManager {
  startTime: number;
  results: Map<string, PlaywrightTestResult>;
  testCases: Map<string, TestCase>;
  testCategories: Map<string, string[]>;
  testResults: Map<string, TestResultData>;
  summary: TestSummary;
  hasEnded: boolean;
}

export interface TestResultProcessor {
  processTestResult(result: PlaywrightTestResult, testCase: TestCase): TestResultData;
  updateSummary(result: TestResultData): void;
  updateTestCategories(testCase: TestCase): void;
}

export interface TestResultsOptions {
  onError?: (error: Error) => void;
  onWarning?: (warning: string) => void;
  onInfo?: (info: string) => void;
} 