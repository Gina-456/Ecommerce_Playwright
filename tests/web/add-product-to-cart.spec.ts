/**
 * Test Case: Add Product to Cart
 *
 * Tags: @master @smoke @regression
 *
 * Steps:
 * 1) Open the application
 * 2) Search for a valid known product
 * 3) Open the product details page
 * 4) Verify that the product details are displayed
 * 5) Set the required quantity
 * 6) Click Add to Cart
 * 7) Verify the product-added success/confirmation message
 * 8) Open the shopping cart
 * 9) Verify that the selected product is present
 * 10) Verify the displayed quantity matches the requested quantity
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Add product to cart test @master @smoke @regression', async ({ homePage, searchResultsPage, productPage, cartPage }) => {
    const product = Helper.getShoppingProductDetails();

    await test.step('1) Open the application', async () => {
        const isHome = await homePage.isHomePageExists();
        expect(isHome).toBeTruthy();
    });

    await test.step('2) Search for a valid known product', async () => {
        await homePage.searchProduct(product.productName);
        const isSearch = await searchResultsPage.isSearchResultsPageExists();
        expect(isSearch).toBeTruthy();
    });

    await test.step('3) Open the product details page', async () => {
        await searchResultsPage.openProduct(product.productName);
    });

    await test.step('4) Verify that the product details are displayed', async () => {
        const isProductDisplayed = await productPage.isProductDisplayed(product.productName);
        expect(isProductDisplayed).toBeTruthy();
    });

    await test.step('5) Set the required quantity', async () => {
        await productPage.setQuantity(product.productQuantity);
    });

    await test.step('6) Click Add to Cart', async () => {
        await productPage.clickAddToCart();
    });

    await test.step('7) Verify the product-added success/confirmation message', async () => {
        const isSuccess = await productPage.isAddToCartSuccessVisible();
        expect(isSuccess).toBeTruthy();
    });

    await test.step('8) Open the shopping cart', async () => {
        await productPage.openShoppingCartFromAlert();
        const isCart = await cartPage.isCartPageExists();
        expect(isCart).toBeTruthy();
    });

    await test.step('9) Verify that the selected product is present', async () => {
        const isProductPresent = await cartPage.isProductPresent(product.productName);
        expect(isProductPresent).toBeTruthy();
    });

    await test.step('10) Verify the displayed quantity matches the requested quantity', async () => {
        const displayedQty = await cartPage.getProductQuantity(product.productName);
        expect(displayedQty).toBe(product.productQuantity);
    });

    console.log('✅ ✔️ Add to cart flow completed successfully!');
});