import { exec } from 'child_process';
import { promisify } from 'util';
import { EmailService } from './reporters/email/email-service';
import { loadEmailConfig } from './reporters/email/email-config';

const execAsync = promisify(exec);

async function runTests() {
  try {
    console.log('🚀 Starting test execution...');
    
    // Run Playwright tests
    const { stdout, stderr } = await execAsync('playwright test');
    console.log(stdout);
    if (stderr) console.error(stderr);

    // Load email configuration
    const emailConfig = await loadEmailConfig();

    // Initialize email service
    const emailService = new EmailService(emailConfig);
    await emailService.initialize();

    // Send simple email with test results
    const result = await emailService.sendEmail({
      html: `
        <h2>Test Execution Results</h2>
        <pre>${stdout}</pre>
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

// Run the tests
runTests(); 