import type { TestCase, TestResult as PlaywrightTestResult } from '@playwright/test/reporter';

export type TestStatus = 'passed' | 'failed' | 'skipped' | 'timedOut' | 'interrupted' | 'unknown' | 'flaky';

export interface EmojiSet {
  passed: string;
  failed: string;
  skipped: string;
  timedOut: string;
  interrupted: string;
  unknown: string;
  flaky: string;
}

export interface EmojiMap {
  [key: string]: string;
}

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
  to: string[];
  subject: string;
}

export interface TestError {
  message?: string;
  stack?: string;
}

export interface TestResult {
  status: TestStatus;
  duration: number;
  error?: TestError;
  screenshot?: string;
  statusEmoji?: string;
  retry?: number;
}

export interface TestSpec {
  id: string;
  title: string;
  result: TestResult;
}

export interface TestSuite {
  id: string;
  title: string;
  specs: TestSpec[];
}

export interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  duration: number;
}

export interface TestResultData {
  status: TestStatus;
  duration: number;
  error?: {
    message: string;
    stack?: string;
  };
  retry?: number;
  retries?: number;
  screenshot?: string;
  testId: string;
}

export interface TestReportData {
  summary: TestSummary;
  results: Map<string, TestResultData>;
  startTime: number;
  endTime: number;
}

export interface PlaywrightReport {
  config: {
    metadata: {
      platform: string;
      projectName: string;
      timestamp: string;
    };
  };
  suites: TestSuite[];
  summary: TestSummary;
}

export interface TemplateOptions extends TestReportData {
  title?: string;
  timestamp?: string;
}

export interface TextTemplateOptions extends TestReportData {
  title?: string;
  timestamp?: string;
  includeDetails?: boolean;
  includeErrors?: boolean;
  includeScreenshots?: boolean;
}

export interface ExtendedTestResult extends Omit<PlaywrightTestResult, 'status' | 'retry'> {
  screenshot?: string;
  retry?: number;
  retries?: number;
  status: TestStatus;
}

export interface TestResultsManager {
  startTime: number;
  hasEnded: boolean;
  summary: TestSummary;
  results: Map<string, ExtendedTestResult>;
  testCases: Map<string, TestCase>;
  testResults: Map<string, TestResultData>;
  testCategories: Map<string, string[]>;
}

export interface TestResultProcessor {
  processTestResult(testResult: ExtendedTestResult, test: TestCase): TestResultData;
  updateSummary(result: TestResultData): void;
  updateTestCategories(test: TestCase): void;
}

export interface TestResultsOptions {
  includeErrors?: boolean;
  includeScreenshots?: boolean;
} 