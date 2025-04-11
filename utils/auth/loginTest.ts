import { Page } from '@playwright/test';

/**
 * Аутентификация в тестовой среде (Test)
 * @param page - объект Playwright Page
 * @param username - логин пользователя
 * @param password - пароль пользователя
 */
export async function loginTest(page: Page, username: string, password: string) {
    console.log("🔐 Logging into Test environment...");

    // Ожидание кнопки "Účet Microsoft"
    const loginElement = page.getByRole('link', { name: 'Účet Microsoft' });
    await loginElement.waitFor({ state: 'visible', timeout: 5000 });
    await loginElement.click();

    // Ввод email
    const emailElement = page.locator('input[name="loginfmt"]');
    await emailElement.waitFor({ state: 'visible', timeout: 5000 });
    await page.fill('input[name="loginfmt"]', username);
    await page.click('input[type="submit"]');

    // Ввод пароля
    const passElement = page.locator('input[name="passwd"]');
    await passElement.waitFor({ state: 'visible', timeout: 5000 });
    await page.fill('input[name="passwd"]', password);
    await page.click('input[type="submit"]');

    // Подтверждение входа (если требуется)
    const submitElement = page.locator('input[type="submit"]');
    await submitElement.waitFor({ state: 'visible', timeout: 10000 });
    await submitElement.click();

    // Дождаться загрузки главной страницы
    await page.waitForLoadState('domcontentloaded');
    console.log("✅ Successfully logged into Test environment.");
}
