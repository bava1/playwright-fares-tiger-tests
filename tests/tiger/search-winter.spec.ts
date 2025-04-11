import { test, expect } from '@playwright/test';
import { setDatesAndNightsInModel, setFilterClick, setTourDataSource, setToursDestinations } from '../../utils/setFilter';
import { dataSet_TZB001 } from '../../utils/setSearchParameters-TZB001';
import { loginProd } from '../../utils/auth/loginProd';
import { clickButtonIfExists } from '../../utils/clickButtonIfExists';

test.describe('Tiger winter search test', () => {
    test('Left aside filter', async ({ page }) => {

        await page.goto(process.env.TIGER_URL_PROD!);
        // await page.goto(process.env.TIGER_URL_DEV!);

        // Authorization
        await loginProd(page, process.env.TEST_USER_EMAIL!, process.env.TEST_USER_PASSWORD!);

        // 1. Zdroj hledání zájezdů. Left aside Filter tourDataSource
        await setTourDataSource(page, dataSet_TZB001.filter.DataSource);

        // 2. Obsazenost. Left aside Filter toursOccupation
        await setFilterClick(page, 'search-panel-filter-toursOccupation');

        // 3. Destinace. Left aside Filter toursDestination
        await setToursDestinations(page, ['Itálie']);
        
        // 4. Termín a délka pobytu. Left aside Filter toursTermDuration 
        await setFilterClick(page, 'search-panel-filter-toursTermDuration');
        // const dateRange = getNextMonthSaturdayRange();
        // console.log(`${dateRange.start} - ${dateRange.end}`);
        await setDatesAndNightsInModel(
            page,
            // dateRange.start,
            // dateRange.end,
            "2025-05-03",
            "2025-05-11",
            ['5', '7']
        );

        // 5. Doprava. Left aside Filter toursTravelOptions
        await setFilterClick(page, 'search-panel-filter-toursTravelOptions');
        await page.getByText('Vlastní').click();     

        // 6. Celkový rozpočet. Left aside Filter toursBudget
        await setFilterClick(page, 'search-panel-filter-toursBudget');

        // 7. Kvalita ubytování. Left aside Filter toursAccommodationQuality
        await setFilterClick(page, 'search-panel-filter-toursAccommodationQuality');   

        // 8. Strava. Left aside Filter toursMeal
        await setFilterClick(page, 'search-panel-filter-toursMeal');   

        // 9. Dostupnost. Left aside Filter availability
        await setFilterClick(page, 'search-panel-filter-availability');   

        // Click search
        await clickButtonIfExists(page, 'search-panel-search');

        // Waiting for loading
        const loadingSpinner = page.locator('.loading-spinner');
        try {
            await loadingSpinner.waitFor({ state: 'hidden', timeout: 40000 });
        } catch (error) {
            console.warn("⚠️ API takes too long to respond. Spinner hasn't disappeared.");
        }

        // Checking the results
        const noResultsMessage = page.locator('text=Nebyly nalezeny žádné zájezdy');
        const searchResults = page.locator('[data-tg-hotel-groups="data"]');

        let totalHotels = 0;
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
            if (await noResultsMessage.isVisible({ timeout: 25000 })) {
                console.log('No tours found.');
                break;
            } else {
                try {
                    const startTime = Date.now();
                    await searchResults.waitFor({ state: 'visible', timeout: 25000 });
                    const endTime = Date.now();
                    console.log(`⏳ Loading time: ${(endTime - startTime) / 1000} seconds`);

                    const hotelCountElements = searchResults.locator('.hotels-info b');
                    const hotelCountTexts = await hotelCountElements.allTextContents();
                    const hotelNumbers = hotelCountTexts
                        .map(text => parseInt(text.replace(/\D/g, ''), 10))
                        .filter(num => !isNaN(num));

                    totalHotels = hotelNumbers.length ? Math.max(...hotelNumbers) : 0;
                    console.log('Total number of hotels:', totalHotels);
                    if (totalHotels > 0) break;
                } catch {
                    console.warn(`⚠️Attempt  ${retryCount + 1} unsuccessful.`);
                    retryCount++;
                    await page.waitForTimeout(5000);
                }
                
            }
        }

        /*
        expect.soft(totalHotels > 0).toBeTruthy();
        if (totalHotels === 0) {
            console.warn("⚠️ Hotels were expected but not found.");
        }
        */

        expect(totalHotels).toBeGreaterThan(0);

        console.log('✅ The test was completed successfully.');
        await page.waitForTimeout(3000);
        await page.click('[data-test-id="layout-logout"]');
    });
});
