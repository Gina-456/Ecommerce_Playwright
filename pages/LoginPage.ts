import { Page, Locator, expect } from '@playwright/test';

import { AccountPage } from './AccountPage';

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly inputEmail: Locator;
    private readonly inputPassword: Locator;
    private readonly btnLogin: Locator;
    private readonly alertWarning: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.inputEmail = page.locator('#input-email');
        this.inputPassword = page.locator('#input-password');
        this.btnLogin = page.getByRole('button', { name: 'Login' });
        this.alertWarning = page.locator('#account-login .alert-danger, #content .alert-danger').first();
    }

    /**
     * Logs in with the given credentials.
     * @param email - Customer email address
     * @param password - Customer password
     * @returns Promise<AccountPage> - Instance of the account page after login
     */
    async login(email: string, password: string): Promise<AccountPage> {
        try {
                await this.fillCredentials(email, password);
                await this.clickLoginButton();
                return new AccountPage(this.page);
            } catch (error) {
                console.log(`Error performing login: ${error}`);
                throw error;
            }
        }

        /**
         * Fills the email and password fields without submitting.
         * @param email - Customer email address
         * @param password - Customer password
         */
        async fillCredentials(email: string, password: string): Promise<void> {
            try {
                await this.inputEmail.fill(email);
                await this.inputPassword.fill(password);
            } catch (error) {
                console.log(`Error filling login credentials: ${error}`);
                throw error;
            }
        }

        /**
         * Clicks the Login button to submit the form.
         * @returns Promise<AccountPage> - Instance of the account page after login
         */
        async clickLoginButton(waitTimeout?: number): Promise<AccountPage> {
            try {
                await this.btnLogin.click();
                // On valid login the page navigates to My Account; on invalid it
                // stays on the login page with a warning. Wait for the page to
                // settle. Accept a caller-provided timeout so data-driven tests
                // can avoid hanging when the remote user doesn't exist.
                if (waitTimeout) {
                    await this.page.waitForLoadState('networkidle', { timeout: waitTimeout }).catch(() => {
                        console.log('waitForLoadState timed out — page may not have navigated');
                    });
                } else {
                    await this.page.waitForLoadState('networkidle');
                }
                return new AccountPage(this.page);
            } catch (error) {
                console.log(`Error clicking login button: ${error}`);
                throw error;
            }
            }

    /**
     * Empties both login fields and submits the form.
     * @returns Promise<AccountPage> - Instance of the account page after login attempt
     */
    async loginWithBlankFields(): Promise<AccountPage> {
        try {
            await this.inputEmail.fill('');
            await this.inputPassword.fill('');
            await this.btnLogin.click();
            return new AccountPage(this.page);
        } catch (error) {
            console.log(`Error submitting blank login: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies the login page is displayed.
     * @returns Promise<boolean> - true if the login button is visible
     */
    async isLoginPageExists(): Promise<boolean> {
        try {
            return await this.btnLogin.isVisible();
        } catch (error) {
            console.log(`Error checking login page: ${error}`);
            return false;
        }
    }

    /**
     * Checks whether the login warning message is displayed.
     * @param message - Expected warning text, or undefined to check any warning
     * @returns Promise<boolean> - true if the warning is visible (and matches when given)
     */
    async isLoginWarningVisible(message?: string): Promise<boolean> {
        try {
                await this.alertWarning.waitFor({ state: 'visible', timeout: 15000 });
            if (message) {
                const text = (await this.alertWarning.textContent()) ?? '';
                return text.replace(/\s+/g, ' ').trim().includes(message);
            }
            return true;
        } catch (error) {
            console.log(`Error checking login warning: ${error}`);
            return false;
        }
    }
}