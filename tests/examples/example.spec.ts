import { test, expect } from '@playwright/test';

test('example test', async ({ page }) => {
  await page.goto('https://plaAAAAAAAAAAAAAAAAAAAAAAAAA');
  await expect(page).toHaveTitle(/Playwright/);
});

test('example test 2', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await expect(page).toHaveTitle(/Playwright/);
});

test.skip('test get started link 45', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Instaffllation' })).toBeVisible();
});

test('test started link', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('test fasfasf get 3', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Instaffllation' })).toBeVisible();
});

test('get test started link 39 adfagfsadgsadg ', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Igggggnst' })).toBeVisible();
});

test('test prooo  link 2', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Isdsssssssnstallation' })).toBeVisible();
});

test.skip('get started link 5', async ({ page }) => {
  await page.goto('https://playwright.dev');
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page.getByRole('heading', { name: 'Inqwion' })).toBeVisible();
});
