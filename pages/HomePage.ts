import { Page, Locator } from '@playwright/test';

import { RegisterPage } from './RegisterPage';
import { LoginPage } from './LoginPage';
import { LogoutPage } from './LogoutPage';
import { SearchResultsPage } from './SearchResultsPage';

export class HomePage {
    private readonly page: Page;

    // Locators
    private readonly menuMyAccount: Locator;
    private readonly linkRegister: Locator;
    private readonly linkLogin: Locator;
    private readonly linkLogout: Locator;
    private readonly txtSearch: Locator;
    private readonly linkLogo: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.menuMyAccount = page.locator('#top-links .dropdown-toggle');
        this.linkRegister = page.locator('#top-links .dropdown').getByRole('link', { name: 'Register' });
        this.linkLogin = page.locator('#top-links .dropdown').getByRole('link', { name: 'Login' });
        this.linkLogout = page.locator('#top-links .dropdown').getByRole('link', { name: 'Logout' });
        this.txtSearch = page.getByRole('textbox', { name: 'Search' });
        this.linkLogo = page.locator('#logo a');
    }

    /**
     * Opens the My Account dropdown menu in the top navigation.
     */
    async openMyAccountMenu(): Promise<void> {
        try {
            await this.menuMyAccount.click();
                await this.page.waitForTimeout(500);
            } catch (error) {
                console.log(`Error opening My Account menu: ${error}`);
                throw error;
            }
        }

    /**
     * Opens the My Account menu and navigates to the Register page.
     * @returns Promise<RegisterPage> - Instance of the register page
     */
    async goToRegisterPage(): Promise<RegisterPage> {
        try {
            await this.openMyAccountMenu();
                await this.page.waitForTimeout(300);
                const registerCount = await this.linkRegister.count();
                if (registerCount > 0) {
                    await this.linkRegister.click();
                } else {
                    // Fallback: navigate directly to the registration URL
                    const base = new URL(this.page.url()).origin;
                    await this.page.goto(`${base}/index.php?route=account/register`);
                }
                await this.page.waitForLoadState('networkidle');
                return new RegisterPage(this.page);
            } catch (error) {
                console.log(`Error navigating to register page: ${error}`);
                throw error;
            }
        }

    /**
     * Opens the My Account menu and navigates to the Login page.
     * @returns Promise<LoginPage> - Instance of the login page
     */
    async goToLoginPage(): Promise<LoginPage> {
        try {
            await this.openMyAccountMenu();
                await this.page.waitForTimeout(300);
                const loginCount = await this.linkLogin.count();
                if (loginCount > 0) {
                    await this.linkLogin.click();
                } else {
                    const base = new URL(this.page.url()).origin;
                    await this.page.goto(`${base}/index.php?route=account/login`);
                }
                await this.page.waitForLoadState('networkidle');
                return new LoginPage(this.page);
            } catch (error) {
                console.log(`Error navigating to login page: ${error}`);
                throw error;
            }
        }

    /**
     * Opens the My Account menu and clicks the Logout link.
     * @returns Promise<LogoutPage> - Instance of the logout page
     */
        async clickLogout(): Promise<LogoutPage> {
        try {
            await this.openMyAccountMenu();
            await this.linkLogout.click();
                return new LogoutPage(this.page);
        } catch (error) {
            console.log(`Error clicking logout: ${error}`);
            throw error;
        }
    }

    /**
         * Searches for a product using the header search field and submits the search.
         * @param productName - Name of the product to search for
         * @returns Promise<SearchResultsPage> - Instance of the search results page
         */
        async searchProduct(productName: string): Promise<SearchResultsPage> {
            try {
                    await this.fillSearchField(productName);
                    await this.submitSearch();
                return new SearchResultsPage(this.page);
            } catch (error) {
                console.log(`Error searching for product: ${error}`);
                throw error;
            }
        }

            /**
             * Checks whether the header search field is visible.
             * @returns Promise<boolean> - true if the search field is displayed
             */
            async isSearchFieldVisible(): Promise<boolean> {
                try {
                    return await this.txtSearch.isVisible();
                } catch (error) {
                    console.log(`Error checking search field: ${error}`);
                    return false;
                }
            }

            /**
             * Fills the header search field with the given product name.
             * @param productName - Name of the product to search for
             */
            async fillSearchField(productName: string): Promise<void> {
                try {
                    await this.txtSearch.fill(productName);
                } catch (error) {
                    console.log(`Error filling search field: ${error}`);
                    throw error;
                }
            }

            /**
             * Submits the search by pressing Enter.
             * @returns Promise<SearchResultsPage> - Instance of the search results page
             */
            async submitSearch(): Promise<SearchResultsPage> {
                try {
                    await this.txtSearch.press('Enter');
                    return new SearchResultsPage(this.page);
                } catch (error) {
                    console.log(`Error submitting search: ${error}`);
                    throw error;
                }
            }

        /**
         * Verifies the home page is displayed and the store header is present.
         * @returns Promise<boolean> - true if the logo and search field are visible
         */
        async isHomePageExists(): Promise<boolean> {
            try {
                return (await this.linkLogo.isVisible()) && (await this.txtSearch.isVisible());
            } catch (error) {
                console.log(`Error checking home page: ${error}`);
                return false;
            }
        }

                /**
                 * Navigates to the home page by clicking the store logo.
                 * @returns Promise<HomePage> - This home page object
                 */
                async clickLogo(): Promise<HomePage> {
                    try {
                        await this.linkLogo.click();
                        return this;
                    } catch (error) {
                        console.log(`Error clicking logo: ${error}`);
                        throw error;
                    }
                }

                /**
                 * Checks whether the current user is logged out (the Logout link is absent
                 * from the My Account dropdown, which instead shows Register and Login).
                 * @returns Promise<boolean> - true if the user is logged out
                 */
                async isLoggedOut(): Promise<boolean> {
                    try {
                        const logoutCount = await this.linkLogout.count();
                        const registerCount = await this.linkRegister.count();
                        return logoutCount === 0 && registerCount > 0;
                    } catch (error) {
                        console.log(`Error checking logged-out state: ${error}`);
                        return false;
                    }
                }
            }