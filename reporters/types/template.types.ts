import { TestResultData, TestSummary, PlaywrightReport, TestReportData } from '../interfaces/types';

export interface TemplateOptions extends TestReportData {
  title?: string;
  theme?: 'light' | 'dark';
}

export interface TextTemplateOptions extends TestReportData {
  includeDetails?: boolean;
  includeErrors?: boolean;
  includeScreenshots?: boolean;
} 