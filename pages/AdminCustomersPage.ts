import { Page, Locator, expect } from '@playwright/test';

export class AdminCustomersPage {
    private readonly page: Page;

    // Locators
    private readonly filterEmailInput: Locator;
    private readonly filterButton: Locator;
    private readonly tableRows: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.filterEmailInput = page.locator('#input-email');
        this.filterButton = page.locator('#button-filter');
        this.tableRows = page.locator('.table-responsive tbody tr');
    }

    /**
     * Verifies the customers list page is displayed.
     * @returns Promise<boolean> - true if the customers table is visible
     */
    async isCustomersPageExists(): Promise<boolean> {
        try {
            await this.page.waitForLoadState('networkidle');
            return await this.filterButton.isVisible();
        } catch (error) {
            console.log(`Error checking admin customers page: ${error}`);
            return false;
        }
    }

    /**
     * Filters the customer list by email address.
     * @param email - The email to search for
     */
    async filterByEmail(email: string): Promise<void> {
        try {
            await this.filterEmailInput.fill(email);
            await this.filterButton.click();
            await this.page.waitForTimeout(500);
        } catch (error) {
            console.log(`Error filtering customers by email: ${error}`);
            throw error;
        }
    }

    /**
     * Checks whether a customer with the given email exists in the filtered list.
     * @param email - The email to look for
     * @returns Promise<boolean> - true if a matching row is found
     */
    async isCustomerInList(email: string): Promise<boolean> {
        try {
            const rows = await this.tableRows.count();
            for (let i = 0; i < rows; i++) {
                const rowText = await this.tableRows.nth(i).textContent();
                if (rowText && rowText.includes(email)) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.log(`Error checking customer in list: ${error}`);
            return false;
        }
    }

    /**
     * Returns the number of customer rows currently displayed.
     * @returns Promise<number> - row count
     */
    async getCustomerRowCount(): Promise<number> {
        try {
            return await this.tableRows.count();
        } catch (error) {
            console.log(`Error getting customer row count: ${error}`);
            return 0;
        }
    }

    /**
     * Gets the displayed name (first + last) for a customer in the list by email.
     * @param email - The email to look for
     * @returns Promise<string | null> - the customer name or null if not found
     */
    async getCustomerNameByEmail(email: string): Promise<string | null> {
        try {
            const rows = await this.tableRows.count();
            for (let i = 0; i < rows; i++) {
                const rowText = await this.tableRows.nth(i).textContent();
                if (rowText && rowText.includes(email)) {
                    const cells = await this.tableRows.nth(i).locator('td').allTextContents();
                    // Column 1 (index 1) is the customer name "FirstName LastName"
                    return cells.length > 1 ? cells[1].trim() : null;
                }
            }
            return null;
        } catch (error) {
            console.log(`Error getting customer name: ${error}`);
            return null;
        }
    }

    /**
     * Gets the displayed status text for a customer in the list by email.
     * @param email - The email to look for
     * @returns Promise<string | null> - the status text or null if not found
     */
    async getCustomerStatusByEmail(email: string): Promise<string | null> {
        try {
            const rows = await this.tableRows.count();
            for (let i = 0; i < rows; i++) {
                const rowText = await this.tableRows.nth(i).textContent();
                if (rowText && rowText.includes(email)) {
                    const cells = await this.tableRows.nth(i).locator('td').allTextContents();
                    // Column 4 (index 4) is the status text
                    return cells.length > 4 ? cells[4].trim() : null;
                }
            }
            return null;
        } catch (error) {
            console.log(`Error getting customer status: ${error}`);
            return null;
        }
    }
}