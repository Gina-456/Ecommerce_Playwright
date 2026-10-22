import { Page, Locator, expect } from '@playwright/test';

import { CartPage } from './CartPage';

export class ProductPage {
    private readonly page: Page;

    // Locators
    private readonly headingProduct: Locator;
    private readonly inputQuantity: Locator;
    private readonly btnAddToCart: Locator;
    private readonly alertSuccess: Locator;
    private readonly linkShoppingCart: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingProduct = page.locator('#content h1');
        this.inputQuantity = page.locator('#input-quantity');
        this.btnAddToCart = page.locator('#button-cart');
        this.alertSuccess = page.locator('.alert-success');
        this.linkShoppingCart = page.locator('.alert-success').getByRole('link', { name: 'shopping cart' });
    }

    /**
     * Sets the requested product quantity.
     * @param quantity - Quantity to set
     */
    async setQuantity(quantity: string): Promise<void> {
        try {
            await this.inputQuantity.fill(quantity);
        } catch (error) {
            console.log(`Error setting quantity: ${error}`);
            throw error;
        }
    }

    /**
     * Clicks the Add to Cart button.
     */
    async clickAddToCart(): Promise<void> {
        try {
            await this.btnAddToCart.click();
        } catch (error) {
            console.log(`Error clicking add to cart: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies the product details page is displayed for the given product.
     * @param productName - Expected product name
     * @returns Promise<boolean> - true if the product heading matches and is visible
     */
    async isProductDisplayed(productName: string): Promise<boolean> {
        try {
            await expect(this.headingProduct).toHaveText(productName);
            return await this.headingProduct.isVisible();
        } catch (error) {
            console.log(`Error checking product page for ${productName}: ${error}`);
            return false;
        }
    }

    /**
     * Verifies the product-added success message is displayed.
     * @returns Promise<boolean> - true if the success alert is visible
     */
    async isAddToCartSuccessVisible(): Promise<boolean> {
        try {
                await this.alertSuccess.waitFor({ state: 'visible', timeout: 15000 });
                return true;
            } catch (error) {
                console.log(`Error checking add-to-cart success message: ${error}`);
                return false;
            }
        }

    /**
     * Clicks the shopping cart link inside the product-added success message.
     * @returns Promise<CartPage> - Instance of the shopping cart page
     */
    async openShoppingCartFromAlert(): Promise<CartPage> {
        try {
            await this.linkShoppingCart.click();
            return new CartPage(this.page);
        } catch (error) {
            console.log(`Error opening shopping cart from alert: ${error}`);
            throw error;
        }
    }
}