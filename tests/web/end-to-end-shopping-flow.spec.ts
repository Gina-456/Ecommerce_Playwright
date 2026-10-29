/**
 * Test Case: End-to-End Shopping Flow
 *
 * Tags: @master @smoke @end-to-end
 *
 * Steps:
 * 1) Open the application
 * 2) Register a new customer using dynamically generated unique data
 * 3) Verify successful registration
 * 4) Log out
 * 5) Log in again using the newly created credentials
 * 6) Verify successful authentication
 * 7) Search for a known product
 * 8) Open the product details page
 * 9) Add the product to the cart
 * 10) Open the shopping cart
 * 11) Verify the correct product
 * 12) Verify the quantity
 * 13) Verify the product price
 * 14) Verify the applicable cart total
 * 15) Verify that the complete journey finishes without errors
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('End-to-end shopping flow test @master @smoke @end-to-end', async ({ homePage, accountPage, searchResultsPage, productPage, cartPage }) => {
    const product = Helper.getShoppingProductDetails();
    const customer = Helper.generateCustomerData();

    await test.step('1) Open the application', async () => {
        const isHome = await homePage.isHomePageExists();
        expect(isHome).toBeTruthy();
    });

    await test.step('2) Register a new customer using dynamically generated unique data', async () => {
        const registerPage = await homePage.goToRegisterPage();
        const isRegister = await registerPage.isRegisterPageExists();
        expect(isRegister).toBeTruthy();

        await registerPage.completeRegistration(customer);
    });

    await test.step('3) Verify successful registration', async () => {
        await accountPage.verifyAccountCreated();
    });

    await test.step('4) Log out', async () => {
        await accountPage.clickContinue();
        const isAccount = await accountPage.isMyAccountExists();
        expect(isAccount).toBeTruthy();

        const logoutPage = await accountPage.clickLogout();
        await logoutPage.verifyLogoutConfirmation();

        const home = await logoutPage.clickContinue();
        const isHomeAfterLogout = await home.isHomePageExists();
        expect(isHomeAfterLogout).toBeTruthy();
    });

    await test.step('5) Log in again using the newly created credentials', async () => {
        const login = await homePage.goToLoginPage();
        const isLogin = await login.isLoginPageExists();
        expect(isLogin).toBeTruthy();

            await login.login(customer.email, customer.password);
    });

    await test.step('6) Verify successful authentication', async () => {
        const isAccount = await accountPage.isMyAccountExists();
        expect(isAccount).toBeTruthy();
    });

    await test.step('7) Search for a known product', async () => {
        const searchResults = await homePage.searchProduct(product.productName);
        const isSearch = await searchResults.isSearchResultsPageExists();
        expect(isSearch).toBeTruthy();
    });

    await test.step('8) Open the product details page', async () => {
            const productPageInstance = await searchResultsPage.openProduct(product.productName);
            const isProduct = await productPageInstance.isProductDisplayed(product.productName);
        expect(isProduct).toBeTruthy();
    });

    await test.step('9) Add the product to the cart', async () => {
        await productPage.setQuantity(product.productQuantity);
        await productPage.clickAddToCart();
        const isSuccess = await productPage.isAddToCartSuccessVisible();
        expect(isSuccess).toBeTruthy();
    });

    await test.step('10) Open the shopping cart', async () => {
        await productPage.openShoppingCartFromAlert();
        const isCart = await cartPage.isCartPageExists();
        expect(isCart).toBeTruthy();
    });

    await test.step('11) Verify the correct product', async () => {
        const isProductPresent = await cartPage.isProductPresent(product.productName);
        expect(isProductPresent).toBeTruthy();
    });

    await test.step('12) Verify the quantity', async () => {
        const qty = await cartPage.getProductQuantity(product.productName);
        expect(qty).toBe(product.productQuantity);
    });

    await test.step('13) Verify the product price', async () => {
        const unitPrice = await cartPage.getProductUnitPrice(product.productName);
        expect(unitPrice).toBe(product.unitPrice);
    });

    await test.step('14) Verify the applicable cart total', async () => {
        const cartTotal = await cartPage.getCartTotal();
        expect(cartTotal).toBe(product.cartTotal);
    });

    await test.step('15) Verify that the complete journey finishes without errors', async () => {
        const isCart = await cartPage.isCartPageExists();
        expect(isCart).toBeTruthy();
    });

    console.log('✅ ✔️ End-to-end shopping flow completed successfully!');
});