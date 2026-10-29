/**
 * Test Case: Product Search Flow
 *
 * Tags: @master @smoke @regression
 *
 * Steps:
 * 1) Open the application
 * 2) Locate the main product search field
 * 3) Enter a valid known product name
 * 4) Submit the search
 * 5) Verify that the search results page is displayed
 * 6) Verify that the expected product appears in the results
 * 7) Verify that the displayed product name matches the search criteria
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Product search flow test @master @smoke @regression', async ({ homePage, searchResultsPage }) => {
    const product = Helper.getShoppingProductDetails();

    await test.step('1) Open the application', async () => {
        const isHome = await homePage.isHomePageExists();
        expect(isHome).toBeTruthy();
    });

    await test.step('2) Locate the main product search field', async () => {
        const isSearchVisible = await homePage.isSearchFieldVisible();
        expect(isSearchVisible).toBeTruthy();
    });

    await test.step('3) Enter a valid known product name', async () => {
        await homePage.fillSearchField(product.productName);
        expect(product.productName).toBeTruthy();
    });

    await test.step('4) Submit the search', async () => {
        await homePage.submitSearch();
    });

    await test.step('5) Verify that the search results page is displayed', async () => {
        const isSearch = await searchResultsPage.isSearchResultsPageExists();
        expect(isSearch).toBeTruthy();
    });

    await test.step('6) Verify that the expected product appears in the results', async () => {
        const isProductListed = await searchResultsPage.isProductListed(product.productName);
        expect(isProductListed).toBeTruthy();
    });

    await test.step('7) Verify that the displayed product name matches the search criteria', async () => {
        const displayedName = await searchResultsPage.getDisplayedProductName(product.productName);
        expect(displayedName).toBe(product.productName);
    });

    console.log('✅ ✔️ Product search flow completed successfully!');
});