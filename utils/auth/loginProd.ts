import { Page } from '@playwright/test';

/**
 * 
 * @param page - Playwright Page object
 * @param username - user login
 * @param password - user password
 */
export async function loginProd(page: Page, username: string, password: string) {
    // console.log("🔐 Logging into Production...");

    await page.locator('[id="username"]').fill(username);
    await page.locator('[id="password"]').fill(password);
    await page.locator('[id="kc-login"]').click();

    // Wait for the main page to load
    await page.waitForLoadState('domcontentloaded');
    console.log("✅ Successfully logged into Production.");
}
