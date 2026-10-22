import { Page, Locator, expect } from '@playwright/test';

import { HomePage } from './HomePage';

export class LogoutPage {
    private readonly page: Page;

    // Locators
    private readonly headingLogout: Locator;
    private readonly linkContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingLogout = page.getByRole('heading', { name: 'Account Logout' });
        this.linkContinue = page.getByRole('link', { name: 'Continue', exact: true });
    }

    /**
     * Verifies the logout confirmation page is displayed.
     */
    async verifyLogoutConfirmation(): Promise<void> {
        try {
            await expect(this.headingLogout).toBeVisible();
        } catch (error) {
            console.log(`Error verifying logout confirmation: ${error}`);
            throw error;
        }
    }

        /**
         * Checks whether the logout confirmation page is displayed.
         * @returns Promise<boolean> - true if the logout heading is visible
         */
        async isLogoutPageExists(): Promise<boolean> {
            try {
                return await this.headingLogout.isVisible();
            } catch (error) {
                console.log(`Error checking logout page: ${error}`);
                return false;
            }
        }

    /**
     * Clicks the Continue link to return to the home page.
     * @returns Promise<HomePage> - Instance of the home page
     */
    async clickContinue(): Promise<HomePage> {
        try {
            await this.linkContinue.click();
            return new HomePage(this.page);
        } catch (error) {
            console.log(`Error clicking logout continue: ${error}`);
            throw error;
        }
    }
}