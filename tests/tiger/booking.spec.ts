import { test, expect } from '@playwright/test';

test('Booking Folder test', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Instaffllation' })).toBeVisible();
});