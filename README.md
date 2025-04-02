# Playwright Test Automation with Email Reports

This project contains automated tests for the Tour Booking Web Service, built with Playwright and configured to send test reports via email.

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

1. Copy the example email configuration file:
```bash
cp email-config.json.example email-config.json
```

2. Update the email configuration in `email-config.json` with your SMTP settings:
```json
{
  "smtp": {
    "host": "your-smtp-server",
    "port": 587,
    "secure": false,
    "auth": {
      "user": "your-email@example.com",
      "pass": "your-password"
    }
  },
  "from": "your-email@example.com",
  "to": ["recipient1@example.com", "recipient2@example.com"],
  "subject": "Tour Booking Web Service Test Report",
  "attachments": {
    "maxCount": 10,
    "types": ["png"],
    "includeScreenshots": true
  }
}
```

Alternatively, you can set the following environment variables:
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_SECURE`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_FROM`
- `EMAIL_TO` (comma-separated list)
- `EMAIL_SUBJECT`

## Running Tests

### Manual Execution

1. Run tests and generate report:
```bash
pnpm run-tests
```

2. View the report locally:
```bash
pnpm report
```

### Scheduled Execution

1. Open PowerShell as Administrator
2. Navigate to the project directory
3. Run the scheduling script:
```bash
.\schedule-tests.ps1
```

The tests will now run automatically at 9:00 AM daily.

## Project Structure

```
playwright-fares-tiger-tests/
├── reporters/
│   ├── email/
│   │   ├── config.ts
│   │   ├── email-service.ts
│   │   ├── index.ts
│   │   └── types.ts
│   └── ...
├── tests/
├── email-config.json
├── run-tests.ts
├── schedule-tests.ps1
└── package.json
```

## Features

- Automated test execution
- HTML test reports
- Email notifications with test results
- Screenshot attachments for failed tests
- Scheduled test runs
- Error handling and retry logic
- Configurable email settings

## Troubleshooting

1. If email sending fails:
   - Check your SMTP settings in `email-config.json`
   - Verify your email credentials
   - Ensure your network allows SMTP connections

2. If scheduled tasks don't run:
   - Check Windows Task Scheduler
   - Verify the task is enabled
   - Check the task's history for errors

3. If tests fail:
   - Check the test logs in `playwright-report/`
   - Review the email report for details
   - Check the screenshots in `test-results/screenshots/`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC 