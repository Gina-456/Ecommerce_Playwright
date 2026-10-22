import { Page, Locator } from '@playwright/test';

import { AccountPage } from './AccountPage';

export interface CustomerData {
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    password: string;
}

export class RegisterPage {
    private readonly page: Page;

    // Locators
    private readonly inputFirstName: Locator;
    private readonly inputLastName: Locator;
    private readonly inputEmail: Locator;
    private readonly inputTelephone: Locator;
    private readonly inputPassword: Locator;
    private readonly inputConfirm: Locator;
    private readonly chkAgree: Locator;
    private readonly btnContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.inputFirstName = page.locator('#input-firstname');
        this.inputLastName = page.locator('#input-lastname');
        this.inputEmail = page.locator('#input-email');
        this.inputTelephone = page.locator('#input-telephone');
        this.inputPassword = page.locator('#input-password');
        this.inputConfirm = page.locator('#input-confirm');
        this.chkAgree = page.locator('input[name="agree"]');
        this.btnContinue = page.locator('input[value="Continue"]');
    }

    /**
         * Fills the registration form with the given customer data.
     * @param customer - Customer details to register with
         */
        async fillRegistrationForm(customer: CustomerData): Promise<void> {
            try {
                await this.inputFirstName.fill(customer.firstName);
                await this.inputLastName.fill(customer.lastName);
                await this.inputEmail.fill(customer.email);
                await this.inputTelephone.fill(customer.telephone);
                await this.inputPassword.fill(customer.password);
                await this.inputConfirm.fill(customer.password);
            } catch (error) {
                console.log(`Error filling registration form: ${error}`);
                throw error;
            }
        }

        /**
         * Checks the Privacy Policy agreement checkbox.
         */
        async acceptPrivacyPolicy(): Promise<void> {
            try {
                await this.chkAgree.check();
            } catch (error) {
                console.log(`Error accepting privacy policy: ${error}`);
                throw error;
            }
        }

        /**
         * Submits the registration form.
         * @returns Promise<AccountPage> - Instance of the account page after submission
         */
        async submitRegistration(): Promise<AccountPage> {
            try {
                await this.btnContinue.click();
                return new AccountPage(this.page);
            } catch (error) {
                console.log(`Error submitting registration: ${error}`);
                throw error;
            }
        }

        /**
         * Fills the registration form and submits it.
         * @param customer - Customer details to register with
         * @returns Promise<AccountPage> - Instance of the next page (account success page)
         */
        async completeRegistration(customer: CustomerData): Promise<AccountPage> {
            try {
                await this.fillRegistrationForm(customer);
                await this.acceptPrivacyPolicy();
                return await this.submitRegistration();
            } catch (error) {
                console.log(`Error completing registration: ${error}`);
                throw error;
            }
        }

    /**
     * Verifies the registration page is displayed.
     * @returns Promise<boolean> - true if the registration form is visible
     */
    async isRegisterPageExists(): Promise<boolean> {
        try {
            return await this.btnContinue.isVisible();
        } catch (error) {
            console.log(`Error checking register page: ${error}`);
            return false;
        }
    }
}