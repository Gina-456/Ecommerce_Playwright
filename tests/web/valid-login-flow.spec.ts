/**
 * Test Case: Valid Login Flow
 *
 * Tags: @master @smoke @regression
 *
 * Steps:
 * 1) Open the application
 * 2) Navigate to My Account → Login
 * 3) Verify that the login page is displayed
 * 4) Register a fresh customer to obtain valid credentials
 * 5) Enter valid customer credentials
 * 6) Submit the login form
 * 7) Verify successful authentication
 * 8) Verify that the user is redirected to the My Account section
 * 9) Verify that the account dashboard / authenticated navigation is visible
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import type { LoginPage } from '../../pages/LoginPage';
import { Helper } from '../../utils/helper';

test('Valid login flow test @master @smoke @regression', async ({ homePage, accountPage }) => {
    const customer = Helper.generateCustomerData();
    let loginPage: LoginPage;

    await test.step('1) Open the application', async () => {
        const isHome = await homePage.isHomePageExists();
        expect(isHome).toBeTruthy();
    });

    await test.step('2) Navigate to My Account → Login', async () => {
        loginPage = await homePage.goToLoginPage();
    });

    await test.step('3) Verify that the login page is displayed', async () => {
        const isLogin = await loginPage.isLoginPageExists();
        expect(isLogin).toBeTruthy();
    });

    await test.step('4) Register a fresh customer to obtain valid credentials', async () => {
        const registerPage = await homePage.goToRegisterPage();
        expect(await registerPage.isRegisterPageExists()).toBeTruthy();
        await registerPage.completeRegistration(customer);
        await accountPage.verifyAccountCreated();
            // The registration auto-logs the customer in; log out first so we
            // can validate a clean login with the same credentials.
            await accountPage.clickContinue();
            const logoutPage = await accountPage.clickLogout();
            await logoutPage.verifyLogoutConfirmation();
            await logoutPage.clickContinue();
            await homePage.clickLogo();
        });

    await test.step('5) Enter valid customer credentials', async () => {
        loginPage = await homePage.goToLoginPage();
        await loginPage.fillCredentials(customer.email, customer.password);
    });

    await test.step('6) Submit the login form', async () => {
        await loginPage.clickLoginButton();
    });

    await test.step('7) Verify successful authentication', async () => {
        const isAccount = await accountPage.isMyAccountExists();
        expect(isAccount).toBeTruthy();
    });

    await test.step('8) Verify the user is redirected to the My Account section', async () => {
        const isAccount = await accountPage.isMyAccountExists();
        expect(isAccount).toBeTruthy();
    });

    await test.step('9) Verify the account dashboard / authenticated navigation is visible', async () => {
        const isAuthenticated = await accountPage.isAuthenticatedOptionsVisible();
        expect(isAuthenticated).toBeTruthy();
    });

    console.log('✅ ✔️ Valid login flow completed successfully!');
});