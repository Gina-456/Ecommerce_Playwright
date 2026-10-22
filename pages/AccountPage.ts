import { Page, Locator, expect } from '@playwright/test';

import { LogoutPage } from './LogoutPage';

export class AccountPage {
    private readonly page: Page;

    // Locators
    private readonly headingSuccess: Locator;
    private readonly headingMyAccount: Locator;
    private readonly linkEditAccount: Locator;
    private readonly linkLogout: Locator;
    private readonly linkContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingSuccess = page.getByRole('heading', { name: 'Your Account Has Been Created!' });
                this.headingMyAccount = page.locator('#content').getByRole('heading', { name: 'My Account', exact: true });
        this.linkEditAccount = page.getByRole('link', { name: 'Edit your account information' });
        this.linkLogout = page.locator('#column-right').getByRole('link', { name: 'Logout' });
        this.linkContinue = page.getByRole('link', { name: 'Continue', exact: true });
    }

    /**
     * Waits until the account-created confirmation page is displayed.
     */
    async verifyAccountCreated(): Promise<void> {
        try {
            await expect(this.headingSuccess).toBeVisible();
        } catch (error) {
            console.log(`Error verifying account created: ${error}`);
            throw error;
        }
    }

        /**
         * Checks whether the account-created page is displayed.
         * @returns Promise<boolean> - true if the success heading is visible
         */
        async isAccountCreatedPageExists(): Promise<boolean> {
            try {
                return await this.headingSuccess.isVisible();
            } catch (error) {
                console.log(`Error checking account created page: ${error}`);
                return false;
            }
        }

        /**
         * Returns the account-created heading text.
         * @returns Promise<string> - The heading text, e.g. "Your Account Has Been Created!"
         */
        async getAccountCreatedHeadingText(): Promise<string> {
            try {
                return (await this.headingSuccess.textContent()) ?? '';
            } catch (error) {
                console.log(`Error reading account created heading: ${error}`);
                throw error;
            }
        }

    /**
     * Clicks the Continue link on the account-created page to enter the account dashboard.
     */
    async clickContinue(): Promise<void> {
        try {
            await this.linkContinue.click();
        } catch (error) {
            console.log(`Error clicking continue: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies the authenticated My Account dashboard is displayed after successful login.
     * @returns Promise<boolean> - true if the dashboard is visible
     */
    async isMyAccountExists(): Promise<boolean> {
        try {
            return await this.headingMyAccount.isVisible();
        } catch (error) {
            console.log(`Error checking My Account page: ${error}`);
            return false;
        }
    }

    /**
     * Verifies the authenticated account options (Edit Account and Logout links) are available.
     * @returns Promise<boolean> - true if authenticated account options are visible
     */
    async isAuthenticatedOptionsVisible(): Promise<boolean> {
        try {
            return (await this.linkEditAccount.isVisible()) && (await this.linkLogout.isVisible());
        } catch (error) {
            console.log(`Error checking authenticated options: ${error}`);
            return false;
        }
    }

    /**
     * Clicks the Logout link in the right column.
     * @returns Promise<LogoutPage> - Instance of the logout page
     */
        async clickLogout(): Promise<LogoutPage> {
        try {
            await this.linkLogout.click();
                return new LogoutPage(this.page);
        } catch (error) {
            console.log(`Error clicking logout: ${error}`);
            throw error;
        }
    }
}