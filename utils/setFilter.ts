import { Page } from '@playwright/test';

export async function setFilterClick(page: Page, filterId: string) {
    const filterLocator = page.locator(`[data-test-id="${filterId}"]`);
    await filterLocator.waitFor({ state: 'visible' });
    await filterLocator.click();
}

/**
 * Function to select tour data sources in the filter panel.
 * @param page - Playwright Page instance.
 * @param sourceIds - Array of source IDs (e.g., ['8', '5']) to check.
 */
export async function setTourDataSource(page: Page, sourceIds: string[]) {
    // Open the filter panel
    await setFilterClick(page, 'search-panel-filter-toursDataSource');

    // Clear previous selections
    await setFilterClick(page, 'search-panel-source-clear');

    // Select the specified checkboxes
    for (const sourceId of sourceIds) {
        const checkboxLocator = page.locator(`[data-test-id="search-panel-source-${sourceId}"]`).getByLabel('');
        await checkboxLocator.check();
    }

    // Confirm the selection
    await page.locator('[data-test-id="search-panel-source-confirm"]').click();
}


/**
 * Function to select one or multiple tour destinations.
 * @param page - Playwright Page instance.
 * @param destinations - Array of destination names (e.g., ['Itálie', 'Řecko']) to select.
 */
export async function setToursDestinations(page: Page, destinations: string[]) {
    // Open the destinations filter panel
    await setFilterClick(page, 'search-panel-filter-toursDestinations');

    // Select each destination from the list
    for (const destination of destinations) {
        const destinationElement = page.locator('span').filter({ hasText: destination }).first();
        await destinationElement.waitFor({ state: 'visible', timeout: 5000 });
        await destinationElement.scrollIntoViewIfNeeded();
        await destinationElement.click();
    }

    // Confirm the selection
    await page.locator('[data-test-id="search-panel-aside-toursDestinations-confirm"]').click();
}
/**
 * Function to set or unset "Fixní termín".
 * @param page - Playwright Page instance.
 * @param enable - Boolean value: `true` to enable, `false` to disable.
 */
export async function setFixingTerm(page: Page, enable: boolean) {
    console.log(`Setting up "Fixní termín": ${enable ? 'On' : 'Off'}`);


    // Checking if a checkbox exists
    const checkbox = page.locator('[data-test-id="search-panel-aside-toursTermDuration-exactRange"] input');
    const label = page.locator('[data-test-id="search-panel-aside-toursTermDuration-exactRange"]');

    if (!(await label.isVisible({ timeout: 5000 }))) {
        console.warn(`Fixní termín is not displayed, it may only be available after selecting dates.`);
        return;
    }

    // Checking the current state of the checkbox
    const isChecked = await checkbox.isChecked();

    if (enable && !isChecked) {
        console.log(`off "Fixní termín"`);
        await label.click(); 
    } else if (!enable && isChecked) {
        console.log(`Turn it off "Fixní termín"`);
        await label.click(); 
    } else {
        console.log(`"Fixní termín" is already in the required condition`);
    }
}


/**
 * Function for setting nights (individual values ​​or intervals).
 * @param page - Playwright Page instance.
 * @param nights - An array of nights or intervals (eg ["7|8|9", "10", "12"]).
 */
export async function setNights(page: Page, nights: string[]) {
    const clearButton = page.locator('[data-test-id="search-panel-aside-toursTermDuration-night-7-9"]');
    await clearButton.waitFor({ state: 'visible' });
    await clearButton.click();

    const dropdown = page.locator('[data-test-id="search-panel-aside-toursTermDuration-numberOfNights"]');
    await dropdown.waitFor({ state: 'visible' });
    await dropdown.click();

    for (const night of nights) {
        const nightOption = page.locator(`[data-test-id="search-panel-aside-toursTermDuration-numberOfNights--${night}"]`);
        await nightOption.waitFor({ state: 'visible' });
        await nightOption.click();
    }
    await dropdown.click();
}


declare const angular: any;

/**
 * Sets dates and nights directly into the filter model via AngularJS.
 */
export async function setDatesAndNightsInModel(
    page: Page,
    departureDate: string,
    returnDate: string,
    nights: string[],
    exactRange: boolean = false
) {

    // We just go straight to the AngularJS scope and model
    await page.evaluate(({ departureDate, returnDate, nights, exactRange }) => {
        const scopeElement = document.querySelector('[data-test-id="search-panel-aside-toursTermDuration-date"]');
        if (scopeElement && angular) {
            const scope = angular.element(scopeElement).scope();

            if (scope && scope.data && scope.data.FilterPlaceholder) {
                scope.data.FilterPlaceholder.DepartureDate = new Date(departureDate);
                scope.data.FilterPlaceholder.ReturnDate = new Date(returnDate);
                scope.data.FilterPlaceholder.Nights = nights;
                scope.data.FilterPlaceholder.ExactRange = exactRange;
                scope.$apply();
            } else {
                throw new Error('Model scope.data.FilterPlaceholder not found');
            }
        } else {
            throw new Error('AngularJS or panel element not found');
        }
    }, { departureDate, returnDate, nights, exactRange });

    // console.log(`Dates and nights have been successfully set to the filter model.`);
}
