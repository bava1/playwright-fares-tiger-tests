# Playwright Test Automation

This project contains automated tests for the PermiSET application using Playwright. It includes test report generation and email notifications.

## Prerequisites

- Node.js (v14 or higher)
- pnpm (v8 or higher)
- Windows OS (for scheduled tasks)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd playwright-fares-tiger-tests
```

2. Install dependencies:
```bash
pnpm install
```

3. Install Playwright browsers:
```bash
pnpm playwright install chromium
```

## Configuration

The project uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```env
# Application Settings
PERMISET_CLIENT_URL=<client-url>
PERMISET_USER_EMAIL=<test-user-email>
PERMISET_USER_PASSWORD=<test-user-password>
TEST_TIMEOUT=<timeout-in-ms>

# Email Settings
SMTP_HOST=<smtp-host>
SMTP_PORT=<smtp-port>
SMTP_SECURE=<true/false>
SMTP_USER=<smtp-username>
SMTP_PASS=<smtp-password>
EMAIL_FROM=<sender-email>
EMAIL_TO=<recipient-emails>
EMAIL_SUBJECT=<email-subject>
```

## Running Tests

### Manual Execution

Run tests and generate report:
```bash
pnpm run-tests
```

### Scheduled Execution

1. Open PowerShell as Administrator
2. Navigate to the project directory
3. Run the scheduling script:
```bash
.\schedule-tests.ps1
```

The tests will run automatically at 9:00 AM daily.

## Project Structure

```
playwright-fares-tiger-tests/
├── reporters/
│   ├── email/              # Email notification system
│   │   ├── config.ts
│   │   ├── email-service.ts
│   │   └── types.ts
│   ├── helpers/            # Utility functions
│   │   ├── helper-file-system.ts
│   │   ├── helper-template.ts
│   │   ├── helper-test-results.ts
│   │   └── helper-text-utils.ts
│   └── generators/         # Report generation
│       └── generator-test-report.ts
├── tests/
│   └── permiset/          # Test suites
│       └── navigation.spec.ts
├── run-tests.ts           # Test runner
└── schedule-tests.ps1     # Scheduling script
```

## Features

- Automated UI testing with Playwright
- Test report generation
- Email notifications for test results
- Screenshot capture for failed tests
- Scheduled test execution
- Error handling and retry logic
- Configurable test timeouts
- Type-safe implementation

## Troubleshooting

1. If tests fail:
   - Check the test logs in `playwright-report/`
   - Review screenshots in `test-results/`
   - Verify environment variables are set correctly

2. If email notifications fail:
   - Verify SMTP settings
   - Check email credentials
   - Ensure network allows SMTP connections

3. If scheduled tasks don't run:
   - Check Windows Task Scheduler
   - Verify task permissions
   - Review task history for errors

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC 