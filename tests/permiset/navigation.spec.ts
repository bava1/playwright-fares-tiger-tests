import { test, expect, BrowserContext, Page } from '@playwright/test';

test.describe('PermiSET Navigation', () => {
    let context: BrowserContext;
    let page: Page;
    const clientURL = 'https://permiset-client-1.vercel.app';
    let authData = {
        userEmail: 'k.asmus@test.com',
        userPassword: '123456'
    };

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        await context.clearCookies();
        page = await context.newPage();
        await page.goto(`${clientURL}/auth/login`);
        await page.waitForTimeout(2000);
        // Authorization
        await page.getByLabel('Email').fill(authData.userEmail);
        await page.getByLabel('Password').fill(authData.userPassword);
        await page.getByRole('button', { name: 'Login' }).click();
    });

    test('Go to homepage', async () => {
        await page.waitForTimeout(2000);
        await expect(page).toHaveURL(`${clientURL}`);
    });

    test('left navigation', async () => {
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Dashboard' }).click();
        await expect(page).toHaveURL(`${clientURL}/dashboard`);
        await page.getByRole('button', { name: 'Users' }).click();
        await expect(page).toHaveURL(`${clientURL}/users`);
        await page.getByRole('button', { name: 'Issues' }).click();
        await expect(page).toHaveURL(`${clientURL}/issues`);
        await page.getByRole('button', { name: 'Blog' }).click();
        await expect(page).toHaveURL(`${clientURL}/blog`);
        await page.getByRole('button', { name: 'Logs' }).click();
        await expect(page).toHaveURL(`${clientURL}/logs`);
        await page.getByRole('button', { name: 'Docs' }).click();
        await expect(page).toHaveURL(`${clientURL}/docs`);
        await page.getByRole('button', { name: 'Settings' }).click();
        await expect(page).toHaveURL(`${clientURL}/setting`);
    });

    test('right navigation', async () => {
        await page.getByRole('button', { name: 'Sethgtings' }).click();
        await expect(page).toHaveURL(`${clientURL}/setting`);
    });

    test.skip('skippp   right navigation', async () => {
        await page.getByRole('button', { name: 'Sethgtings' }).click();
        await expect(page).toHaveURL(`${clientURL}/setting`);
    });

    test('Go logout', async () => {
        await page.getByRole('button', { name: 'Home' }).click();
        await expect(page).toHaveURL(`${clientURL}`);
    });
});

