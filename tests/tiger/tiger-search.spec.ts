import { test, expect } from '@playwright/test';

test('Tiger Folder test', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Instaffllation' })).toBeVisible();
});

test('Tiger flaky test ', async () => {
  const random = Math.random();

  console.log(`Random value 2: ${random}`);

  expect(random).toBeGreaterThan(0.5);
});

test('Tiger proo test', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});