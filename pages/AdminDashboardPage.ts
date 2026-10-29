import { Page, Locator } from '@playwright/test';

import { AdminCustomersPage } from './AdminCustomersPage';

export class AdminDashboardPage {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Verifies the admin dashboard is displayed.
     * @returns Promise<boolean> - true if the dashboard heading is visible
     */
    async isDashboardExists(): Promise<boolean> {
        try {
            await this.page.waitForLoadState('networkidle');
            const heading = this.page.getByRole('heading', { name: 'Dashboard', exact: true });
            return await heading.isVisible();
        } catch (error) {
            console.log(`Error checking admin dashboard: ${error}`);
            return false;
        }
    }

    /**
     * Navigates to Customers section by extracting the user_token from the current
     * URL and building the customers page URL directly.
     * @returns Promise<AdminCustomersPage> - Instance of the admin customers page
     */
    async goToCustomers(): Promise<AdminCustomersPage> {
        try {
            const currentUrl = this.page.url();
            const tokenMatch = currentUrl.match(/user_token=([a-zA-Z0-9_]+)/);
            if (!tokenMatch) {
                throw new Error('Could not extract user_token from admin URL');
            }
            const userToken = tokenMatch[1];
            const customersUrl = `http://localhost/opencart/upload/admin/index.php?route=customer/customer&user_token=${userToken}`;
            await this.page.goto(customersUrl);
            await this.page.waitForLoadState('networkidle');
            return new AdminCustomersPage(this.page);
        } catch (error) {
            console.log(`Error navigating to admin customers: ${error}`);
            throw error;
        }
    }
}