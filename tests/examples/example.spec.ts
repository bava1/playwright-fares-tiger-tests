import { test, expect } from '@playwright/test';

test('example passed test 2', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/);
});


test.skip('example skip failed test 2', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Instaffllation' })).toBeVisible();
});


test('example failed test', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Instaffllagjfsjtion' })).toBeVisible();
});


test('Example times flaky test ', async () => {
  const random = Math.random();

  console.log(`Random value 1: ${random}`);
  expect(random).toBeGreaterThan(0.5);
});
