import { Page, Locator } from '@playwright/test';

import { AdminDashboardPage } from './AdminDashboardPage';

export class AdminLoginPage {
    private readonly page: Page;

    // Locators
    private readonly inputUsername: Locator;
    private readonly inputPassword: Locator;
    private readonly btnLogin: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.inputUsername = page.locator('#input-username');
        this.inputPassword = page.locator('#input-password');
        this.btnLogin = page.getByRole('button', { name: 'Login' });
    }

    /**
     * Opens the admin login page.
     */
    async goto(): Promise<void> {
        await this.page.goto('http://localhost/opencart/upload/admin/index.php');
    }

    /**
     * Logs in to the admin portal.
     * @param username - Admin username
     * @param password - Admin password
     * @returns Promise<AdminDashboardPage> - Instance of the admin dashboard page
     */
    async login(username: string, password: string): Promise<AdminDashboardPage> {
        try {
            await this.inputUsername.fill(username);
            await this.inputPassword.fill(password);
            await this.btnLogin.click();
            await this.page.waitForLoadState('networkidle');
            return new AdminDashboardPage(this.page);
        } catch (error) {
            console.log(`Error logging into admin portal: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies the admin login page is displayed.
     * @returns Promise<boolean> - true if the login form is visible
     */
    async isLoginPageExists(): Promise<boolean> {
        try {
            return await this.btnLogin.isVisible();
        } catch (error) {
            console.log(`Error checking admin login page: ${error}`);
            return false;
        }
    }
}