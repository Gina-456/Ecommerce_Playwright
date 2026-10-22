import { Page, Locator } from '@playwright/test';

import { ProductPage } from './ProductPage';

export class SearchResultsPage {
    private readonly page: Page;

    // Locators
    private readonly headingSearch: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingSearch = page.getByRole('heading', { name: /^Search - / });
    }

    /**
     * Opens the product details page for the given product name from the search results.
     * @param productName - Name of the product to open
     * @returns Promise<ProductPage> - Instance of the product page
     */
    async openProduct(productName: string): Promise<ProductPage> {
        try {
            await this.page.getByRole('heading', { level: 4 })
                .getByRole('link', { name: productName, exact: true })
                .click();
            return new ProductPage(this.page);
        } catch (error) {
            console.log(`Error opening product ${productName}: ${error}`);
            throw error;
        }
    }

        /**
         * Checks whether the given product appears in the search results.
         * @param productName - Name of the product to look for
         * @returns Promise<boolean> - true if a matching product heading/link is listed
         */
        async isProductListed(productName: string): Promise<boolean> {
            try {
                const link = this.page.getByRole('heading', { level: 4 })
                    .getByRole('link', { name: productName, exact: true });
                return (await link.count()) > 0;
            } catch (error) {
                console.log(`Error checking product listing for ${productName}: ${error}`);
                return false;
            }
        }

        /**
         * Returns the displayed name of the given product in the search results.
         * @param productName - Name of the product to read
         * @returns Promise<string> - The displayed product name
         */
        async getDisplayedProductName(productName: string): Promise<string> {
            try {
                const link = this.page.getByRole('heading', { level: 4 })
                    .getByRole('link', { name: productName, exact: true })
                    .first();
                return (await link.textContent()) ?? '';
            } catch (error) {
                console.log(`Error reading displayed product name for ${productName}: ${error}`);
                throw error;
            }
        }

    /**
     * Verifies the search results page is displayed.
     * @returns Promise<boolean> - true if the search heading is visible
     */
    async isSearchResultsPageExists(): Promise<boolean> {
        try {
            return await this.headingSearch.isVisible();
        } catch (error) {
            console.log(`Error checking search results page: ${error}`);
            return false;
        }
    }
}