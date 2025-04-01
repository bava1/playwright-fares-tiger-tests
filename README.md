# Automated Testing System for Tour Booking Web Service

This project is designed for automated testing of a tour booking web service using Playwright. The system includes testing of core functions, report generation, and email result delivery.

## Features

- ✅ Automated testing of key tour booking service functions
- 📊 Generation of detailed HTML and text reports
- 📷 Screenshot attachments for failed tests
- 📧 Email report delivery
- ⏰ Scheduled test execution

## Requirements

- Node.js 14 or higher
- npm or pnpm
- Access to SMTP server for email delivery

## Installation

```bash
# Clone repository
git clone <repository-url>
cd <project-name>

# Install dependencies
npm install
# or
pnpm install

# Install Playwright browsers
npx playwright install
```

## Configuration

### Email Configuration

Create an `email-config.json` file in the project root:

```json
{
  "host": "smtp.example.com",
  "port": 587,
  "secure": false,
  "auth": {
    "user": "your-email@example.com",
    "pass": "your-password"
  },
  "from": "automated-tests@example.com",
  "to": ["recipient1@example.com", "recipient2@example.com"],
  "subject": "Tour Booking Web Service Test Report"
}
```

Or configure environment variables:

```
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-password
EMAIL_FROM=automated-tests@example.com
EMAIL_TO=recipient1@example.com,recipient2@example.com
EMAIL_SUBJECT=Tour Booking Web Service Test Report
```

### Automated Test Execution Setup

To set up automatic cron job, run:

```bash
sudo node setup-cron.js
```

By default, tests will run daily at 6:00 AM. To change the time, use environment variables:

```
CRON_HOUR=8
CRON_MINUTE=30
```

## Usage

### Manual Test Execution

```bash
# Run all tests
npm test

# Run specific test
npx playwright test tests/booking.spec.ts
```

### Report Generation

Reports are automatically generated after test execution in the `reports/` directory.

### Email Report Delivery

```bash
# Send latest report
npm run report
```

## Project Structure

- `tests/` - Test directory
  - `booking.spec.ts` - Tests for the booking web service
- `reporters/generators/generator-test-report.ts` - Reporter for generating text and HTML reports
- `email-reporter.ts` - Module for email report delivery
- `setup-cron.js` - Script for automated execution setup
- `reports/` - Directory for generated reports
- `test-results/` - Directory for screenshots and traces

## Test Examples

The project includes test examples for core booking web service functions:

- Main page loading verification
- Tour search testing
- Tour page display verification
- Booking process testing
- User authentication verification
- Personal account testing

## Extending Functionality

To add new tests, create new files in the `tests/` directory following the existing examples.

## Troubleshooting

If you encounter issues with report delivery, check:

1. SMTP configuration in `email-config.json`
2. SMTP server access
3. Error logs in the console

## License

MIT 