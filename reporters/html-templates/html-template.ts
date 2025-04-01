export const htmlTemplate = (summary: {
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
}, testCategories: Map<string, string[]>, testResults: Map<string, {
  status: string;
  duration: number;
  error?: {
    message?: string;
    stack?: string;
  };
  screenshot?: string;
  statusEmoji?: string;
}>) => {
  // Функция для очистки ANSI-кодов из текста
  const stripAnsi = (str: string | undefined) => {
    return str?.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '') || '';
  };

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Report</title>
    <style>
      @font-face {
        font-family: "Noto Color Emoji";
        src: url("https://raw.githack.com/googlefonts/noto-emoji/main/fonts/NotoColorEmoji.ttf");
      }
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f5f5f5;
      }
      pre {
        margin: 0 auto !important;
        padding: 0 !important;
      }
      h4 {
        margin: 0 !important;
      }
      .header {
        background-color: #4CAF50;
        color: white;
        padding: 5px 20px;
        text-align: center;
        border-radius: 5px;
        margin-bottom: 20px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      }
      .summary {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 15px;
        margin-bottom: 10px;
      }
      .summary-card {
        flex: 1;
        min-width: 150px;
        background-color: white;
        border-radius: 5px;
        padding: 10px;
        text-align: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      .summary-card.passed { border-top: 5px solid #4CAF50; }
      .summary-card.failed { border-top: 5px solid #f44336; }
      .summary-card.skipped { border-top: 5px solid #ff9800; }
      .summary-card.time { border-top: 5px solid #2196F3; }
      
      .category {
        margin: 25px 0 55px 0;
      }
      .category-header {
        background-color: #2196F3;
        color: white;
        padding: 10px 15px;
        font-weight: bold;
        text-transform: uppercase;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      }
      .test-list {
        padding: 0;
        margin: 0;
        list-style: none;
      }
      .test-item {
        padding: 15px 15px;
        margin: 7px auto;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      }
      .test-item:last-child {
        border-bottom: none;
      }
      .test-item.passed { background-color: #f1f8e9; }
      .test-item.failed { background-color: #ffebee; }
      .test-item.skipped { background-color: #fff3e0; }
      .test-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      .test-title {
        font-weight: bold;
        flex: 1;
      }
      .test-status {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.9em;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .test-status.passed { background-color: #4CAF50; color: white; }
      .test-status.failed { background-color: #f44336; color: white; }
      .test-status.skipped { background-color: #ff9800; color: white; }
      .test-duration {
        color: #666;
        font-size: 0.9em;
      }
      .test-error {
        padding: 0 10px;
        background-color: #ffebee;
        border-radius: 4px;
        font-family: monospace;
        white-space: pre-wrap;
      }
      .test-screenshot {
        margin-top: 10px;
        max-width: 100%;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      .chart-container {
        background-color: white;
        border-radius: 5px;
        padding: 20px;
        margin-bottom: 30px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      .test-screenshot-info {
        margin-top: 10px;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .screenshot-icon {
        font-size: 1.2em;
      }
      .screenshot-link {
        color: #2196F3;
        text-decoration: none;
      }
      .screenshot-link:hover {
        text-decoration: underline;
      }
      .emoji {
        font-family: "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
        font-size: 1em;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>Test Report</h1>
      <p>Generated on: ${new Date().toLocaleString()}</p>
    </div>

    <div class="summary">
      <div class="summary-card passed">
        <h4>Passed</h4>
        <p><span class="emoji">✅</span> ${summary.passed}</p>
      </div>
      <div class="summary-card failed">
        <h4>Failed</h4>
        <p><span class="emoji">❌</span> ${summary.failed}</p>
      </div>
      <div class="summary-card skipped">
        <h4>Skipped</h4>
        <p><span class="emoji">⏩</span> ${summary.skipped}</p>
      </div>
      <div class="summary-card time">
        <h4>Duration</h4>
        <p><span class="emoji">⏱️</span> ${(summary.duration / 1000).toFixed(2)}s</p>
      </div>
    </div>

    ${Array.from(testCategories.entries()).map(([category, tests]) => `
      <div class="category">
        <div class="category-header"><span class="emoji">📁</span> ${category}</div>
        <ul class="test-list">
          ${tests.map(testName => {
            const testId = `${category}:${testName}`;
            const result = testResults.get(testId);
            
            if (!result) return '';

            return `
              <li class="test-item ${result.status}">
                <div class="test-header">
                  <div class="test-title">${testName}</div>
                  <div class="test-status ${result.status}">
                     ${result.status.toUpperCase()}
                  </div>
                </div>
                <div class="test-duration"><span class="emoji">${result.statusEmoji || ''}</span> Duration: ${((result.duration || 0) / 1000).toFixed(2)}s</div>
                
                ${result.status === 'failed' && result.error ? `
                  <div class="test-error">
                    <pre><span class="emoji">${result.statusEmoji || ''}</span> Error: ${stripAnsi(result.error.message) || 'Unknown error'}</pre>
                  </div>
                ` : ''}
              </li>
            `;
          }).join('')}
        </ul>
      </div>
    `).join('')}

    <div class="chart-container">
      <canvas id="pie-chart"></canvas>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const ctx = document.getElementById('pie-chart').getContext('2d');
        const pieChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['${summary.passed} Passed', '${summary.failed} Failed', '${summary.skipped} Skipped'],
            datasets: [{
              data: [ ${summary.passed}, ${summary.failed}, ${summary.skipped}],
              backgroundColor: ['#4CAF50', '#f44336', '#ff9800']
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false,
                position: 'bottom',
              },
              title: {
                display: true,
                text: 'Test Results Distribution',
                font: {
                  size: 18,
                  weight: 'bold',
                }
              }
            }
          }
        });
      });
    </script>
  </body>
  </html>`;
}; 