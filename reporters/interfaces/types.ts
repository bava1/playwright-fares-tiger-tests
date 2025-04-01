import { TestStatus } from '../types/emoji.types';

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
  duration: number;
}

export interface TestResultData {
  status: TestStatus;
  duration: number;
  error?: TestError;
  retry?: number;
  screenshot?: string;
}

export interface TestReportData {
  summary: TestSummary;
  results: Map<string, TestResultData>;
  startTime: number;
  endTime: number;
}

export interface PlaywrightReport {
  stats: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
  };
  suites: TestSuite[];
} 