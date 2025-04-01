import { Reporter, TestCase, TestResult as PlaywrightTestResult, FullResult } from '@playwright/test/reporter';

export interface TestResultData {
  status: string;
  error?: {
    message?: string;
    stack?: string;
  };
  duration: number;
  retry?: number;
  screenshot?: string;
}

export interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  duration: number;
}

export interface PlaywrightReport {
  stats: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
  };
  suites: Array<{
    id: string;
    title: string;
    specs: any[];
    status: string;
    error?: {
      message?: string;
      stack?: string;
    };
    duration: number;
    retry?: number;
    screenshot?: string;
  }>;
}

export interface EnhancedReporter extends Reporter {
  startTime: number;
  results: Map<string, PlaywrightTestResult>;
  testCases: Map<string, TestCase>;
  testCategories: Map<string, string[]>;
  hasEnded: boolean;
  testResults: Map<string, TestResultData>;
  summary: TestSummary;
} 