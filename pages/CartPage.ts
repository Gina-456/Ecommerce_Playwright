import { Page, Locator } from '@playwright/test';

export class CartPage {
    private readonly page: Page;

    // Locators
    private readonly headingCart: Locator;
    private readonly tableTotals: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingCart = page.getByRole('heading', { name: /^Shopping Cart / });
        // The totals table is the second table-bordered table inside #content
        this.tableTotals = page.locator('#content table.table-bordered').nth(1);
    }

    /**
     * Verifies the shopping cart page is displayed.
     * @returns Promise<boolean> - true if the cart heading is visible
     */
    async isCartPageExists(): Promise<boolean> {
        try {
            return await this.headingCart.isVisible();
        } catch (error) {
            console.log(`Error checking cart page: ${error}`);
            return false;
        }
    }

    /**
     * Locates the product row in the cart for the given product name.
     * @param productName - Name of the product shown in the cart
     * @returns Locator - The product table row
     */
    private getProductRow(productName: string): Locator {
        return this.page.locator('#content table.table-bordered').first()
            .getByRole('row')
            .filter({ has: this.page.getByRole('link', { name: productName, exact: true }) });
    }

    /**
     * Checks whether the expected product is present in the cart.
     * @param productName - Expected product name
     * @returns Promise<boolean> - true if the product row exists
     */
    async isProductPresent(productName: string): Promise<boolean> {
        try {
            return await this.getProductRow(productName).count() > 0;
        } catch (error) {
            console.log(`Error checking product presence in cart: ${error}`);
            return false;
        }
    }

    /**
     * Returns the quantity entered in the quantity input of the product row.
     * @param productName - Name of the product shown in the cart
     * @returns Promise<string> - The displayed quantity
     */
    async getProductQuantity(productName: string): Promise<string> {
        try {
            return await this.getProductRow(productName).locator('input[type="text"]').inputValue();
        } catch (error) {
            console.log(`Error reading product quantity: ${error}`);
            throw error;
        }
    }

    /**
     * Returns the unit price shown for the product row.
     * @param productName - Name of the product shown in the cart
     * @returns Promise<string> - The displayed unit price (e.g. "$602.00")
     */
    async getProductUnitPrice(productName: string): Promise<string> {
        try {
            return (await this.getProductRow(productName).getByRole('cell').nth(4).textContent()) ?? '';
        } catch (error) {
            console.log(`Error reading product unit price: ${error}`);
            throw error;
        }
    }

    /**
     * Returns the cart total from the totals table.
     * @returns Promise<string> - The displayed grand total (e.g. "$1,204.00")
     */
    async getCartTotal(): Promise<string> {
        try {
                const totalCell = this.tableTotals.getByRole('row').filter({ has: this.page.getByText('Total:', { exact: true }) });
                return (await totalCell.getByRole('cell').nth(1).textContent()) ?? '';
            } catch (error) {
                console.log(`Error reading cart total: ${error}`);
                throw error;
            }
        }
}