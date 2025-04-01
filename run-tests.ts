const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

// Setup paths and variables
const PROJECT_ROOT: string = process.cwd();
const LOG_DIR: string = path.join(PROJECT_ROOT, 'logs');
const LOG_FILE: string = path.join(LOG_DIR, `test-run-${format(new Date(), 'yyyyMMdd')}.log`);
let ERROR_COUNT: number = 0;

// Logging function
function log(message: string): void {
    const timestamp: string = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const logMessage: string = `[${timestamp}] ${message}\n`;
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true });
    }
    
    // Write to file and output to console
    fs.appendFileSync(LOG_FILE, logMessage);
    console.log(message);
}

// Function to check if command exists
function checkCommand(command: string): boolean {
    try {
        execSync(`where ${command}`, { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}

// Check if Node.js is installed
if (!checkCommand('node')) {
    log('ERROR: Node.js is not installed');
    ERROR_COUNT++;
    process.exit(1);
}

// Check if pnpm is installed
if (!checkCommand('pnpm')) {
    log('ERROR: pnpm is not installed');
    ERROR_COUNT++;
    process.exit(1);
}

// Check if package.json exists
if (!fs.existsSync(path.join(PROJECT_ROOT, 'package.json'))) {
    log('ERROR: package.json not found');
    ERROR_COUNT++;
    process.exit(1);
}

try {
    // Install/update dependencies
    log('Installing dependencies...');
    execSync('pnpm install', { stdio: 'inherit' });

    // Install Playwright browsers
    log('Installing Playwright browsers...');
    execSync('pnpm playwright install chromium', { stdio: 'inherit' });

    // Run tests
    log('Running tests...');
    execSync('pnpm playwright test', { stdio: 'inherit' });

    // Check if reports exist
    if (!fs.existsSync(path.join(PROJECT_ROOT, 'logs', 'test-report.json'))) {
        log('ERROR: Test report was not created');
        ERROR_COUNT++;
        process.exit(1);
    }

    log('Tests completed successfully');
    process.exit(0);
} catch (error) {
    if (error instanceof Error) {
        log(`ERROR: ${error.message}`);
    } else {
        log('ERROR: An unknown error occurred');
    }
    ERROR_COUNT++;
    log(`Exiting with errors (error count: ${ERROR_COUNT})`);
    process.exit(1);
} 