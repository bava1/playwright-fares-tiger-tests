import { Page } from '@playwright/test';

export async function clickButtonIfExists(page: Page, buttonTestId: string) {
    const button = page.locator(`[data-test-id="${buttonTestId}"]`);
    if (await button.isVisible()) {
        await button.scrollIntoViewIfNeeded();
        await button.click();
    }
}