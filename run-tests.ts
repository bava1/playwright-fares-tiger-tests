import { exec } from 'child_process';
import { promisify } from 'util';
import { EmailService } from './reporters/email/email-service';
import { loadEmailConfig } from './reporters/email/email-config';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

interface ExecError extends Error {
  stdout?: string;
  stderr?: string;
  code?: number;
}

interface TestResult {
  title: string;
  status: 'passed' | 'failed' | 'skipped' | 'flaky';
  duration: number;
  error?: string;
}

function parseTestResults(output: string): TestResult[] {
  const results: TestResult[] = [];
  const lines = output.split('\n');
  
  for (const line of lines) {
    if (line.includes('✓') || line.includes('×')) {
      const status = line.includes('✓') ? 'passed' : 'failed';
      const title = line.split(']')[1]?.trim() || '';
      const durationMatch = line.match(/\((\d+)ms\)/);
      const duration = durationMatch ? parseInt(durationMatch[1]) : 0;
      
      // Проверяем, является ли тест flaky (провалился, но имеет информацию о повторных попытках)
      const isFlaky = status === 'failed' && line.includes('retry');
      
      results.push({
        title,
        status: isFlaky ? 'flaky' : status,
        duration,
      });
    }
  }
  
  return results;
}

async function runTests() {
  try {
    console.log('🚀 Starting test execution...');
    
    // Run Playwright tests
    const { stdout, stderr } = await execAsync('npx playwright test');
    console.log(stdout);
    if (stderr) console.error(stderr);

    // Парсим результаты тестов
    const testResults = parseTestResults(stdout);
    
    // Группируем результаты по статусу
    const groupedResults = testResults.reduce((acc, result) => {
      if (!acc[result.status]) {
        acc[result.status] = [];
      }
      acc[result.status].push(result);
      return acc;
    }, {} as Record<string, TestResult[]>);

    // Формируем отчет для parsed-log.txt
    let report = '📋 Test Report\n';
    report += '----------------\n\n';
    
    // Добавляем информацию о flaky-тестах
    if (groupedResults['flaky']?.length) {
      report += '⚠️ Flaky Tests:\n';
      groupedResults['flaky'].forEach(test => {
        report += `- ${test.title} (${test.duration}ms)\n`;
      });
      report += '\n';
    }
    
    // Добавляем информацию о проваленных тестах
    if (groupedResults['failed']?.length) {
      report += '❌ Failed Tests:\n';
      groupedResults['failed'].forEach(test => {
        report += `- ${test.title} (${test.duration}ms)\n`;
      });
      report += '\n';
    }
    
    // Добавляем статистику
    report += '📊 Test Statistics:\n';
    report += `Total Tests: ${testResults.length}\n`;
    report += `Passed: ${groupedResults['passed']?.length || 0}\n`;
    report += `Failed: ${groupedResults['failed']?.length || 0}\n`;
    report += `Flaky: ${groupedResults['flaky']?.length || 0}\n`;
    report += `Skipped: ${groupedResults['skipped']?.length || 0}\n`;

    // Сохраняем отчет в файл
    const parsedLogPath = path.join(process.cwd(), 'logs', 'parsed-log.txt');
    await fs.writeFile(parsedLogPath, report, 'utf-8');

    // Load email configuration
    const emailConfig = await loadEmailConfig();

    // Initialize email service
    const emailService = new EmailService(emailConfig);
    await emailService.initialize();

    // Send email with parsed log content
    const result = await emailService.sendEmail({
      html: `
        <h2>Test Report</h2>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <pre style="font-family: monospace; white-space: pre-wrap;">${report}</pre>
      `,
    });

    if (result.success) {
      console.log('✅ Test results sent successfully');
    } else {
      console.error('❌ Failed to send test results:', result.error);
    }

    // Cleanup
    await emailService.cleanup();

  } catch (error) {
    console.error('❌ Error during test execution:', error);
    process.exit(1);
  }
}

async function runTestsTry() {
  try {
    console.log('🚀 Starting test execution (TEST MODE)...');
    
    // Run Playwright tests
    let stdout = '';
    let stderr = '';
    try {
      const result = await execAsync('npx playwright test');
      stdout = result.stdout;
      stderr = result.stderr;
    } catch (error) {
      const execError = error as ExecError;
      if (execError.stdout) stdout = execError.stdout;
      if (execError.stderr) stderr = execError.stderr;
      console.log('⚠️ Some tests failed, but continuing to show report...');
    }

    console.log(stdout);
    if (stderr) console.error(stderr);

    // Парсим результаты тестов
    const testResults = parseTestResults(stdout);
    
    // Группируем результаты по статусу
    const groupedResults = testResults.reduce((acc, result) => {
      if (!acc[result.status]) {
        acc[result.status] = [];
      }
      acc[result.status].push(result);
      return acc;
    }, {} as Record<string, TestResult[]>);

    // Формируем отчет
    let report = '\n📋 Test Report:\n';
    report += '----------------\n';
    
    // Добавляем информацию о flaky-тестах
    if (groupedResults['flaky']?.length) {
      report += '\n⚠️ Flaky Tests:\n';
      groupedResults['flaky'].forEach(test => {
        report += `- ${test.title} (${test.duration}ms)\n`;
      });
    }
    
    // Добавляем информацию о проваленных тестах
    if (groupedResults['failed']?.length) {
      report += '\n❌ Failed Tests:\n';
      groupedResults['failed'].forEach(test => {
        report += `- ${test.title} (${test.duration}ms)\n`;
      });
    }
    
    // Добавляем статистику
    report += '\n📊 Test Statistics:\n';
    report += `Total Tests: ${testResults.length}\n`;
    report += `Passed: ${groupedResults['passed']?.length || 0}\n`;
    report += `Failed: ${groupedResults['failed']?.length || 0}\n`;
    report += `Flaky: ${groupedResults['flaky']?.length || 0}\n`;
    report += `Skipped: ${groupedResults['skipped']?.length || 0}\n`;

    console.log(report);
    console.log('\n✅ Test execution completed');

  } catch (error) {
    console.error('❌ Error during test execution:', error);
  }
}

// Run the tests
// runTests();  // Uncomment to run with email
runTestsTry();  // Run in test mode 