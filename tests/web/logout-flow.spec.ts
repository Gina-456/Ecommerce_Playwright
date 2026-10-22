/**
 * Test Case: Logout Flow
 *
 * Tags: @master @sanity @regression
 *
 * Steps:
 * 1) Open the application
 * 2) Register a fresh customer to obtain valid credentials
 * 3) Log in using the valid customer credentials
 * 4) Verify that authentication succeeds
 * 5) Navigate to the account logout option
 * 6) Click Logout
 * 7) Verify that the logout confirmation page is displayed
 * 8) Click Continue
 * 9) Verify the expected redirect (homepage)
 * 10) Verify that authenticated account options are no longer available
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Logout flow test @master @sanity @regression', async ({ homePage, accountPage, logoutPage }) => {
    const customer = Helper.generateCustomerData();

    await test.step('1) Open the application', async () => {
        const isHome = await homePage.isHomePageExists();
        expect(isHome).toBeTruthy();
    });

    await test.step('2) Register a fresh customer to obtain valid credentials', async () => {
        const registerPage = await homePage.goToRegisterPage();
        expect(await registerPage.isRegisterPageExists()).toBeTruthy();
        await registerPage.completeRegistration(customer);
        await accountPage.verifyAccountCreated();
            // Registration auto-logs the customer in; log out before logging in
            await accountPage.clickContinue();
            const logoutPage = await accountPage.clickLogout();
            await logoutPage.verifyLogoutConfirmation();
            await logoutPage.clickContinue();
            await homePage.clickLogo();
        });

    await test.step('3) Log in using the valid customer credentials', async () => {
        const loginPage = await homePage.goToLoginPage();
        await loginPage.login(customer.email, customer.password);
    });

    await test.step('4) Verify that authentication succeeds', async () => {
        const isAccount = await accountPage.isMyAccountExists();
        expect(isAccount).toBeTruthy();
    });

    await test.step('5) Navigate to the account logout option', async () => {
        const isOptionVisible = await accountPage.isAuthenticatedOptionsVisible();
        expect(isOptionVisible).toBeTruthy();
    });

    await test.step('6) Click Logout', async () => {
        await accountPage.clickLogout();
    });

    await test.step('7) Verify that the logout confirmation page is displayed', async () => {
        await logoutPage.verifyLogoutConfirmation();
        const isConfirmation = await logoutPage.isLogoutPageExists();
        expect(isConfirmation).toBeTruthy();
    });

    await test.step('8) Click Continue', async () => {
        const home = await logoutPage.clickContinue();
        const isHome = await home.isHomePageExists();
        expect(isHome).toBeTruthy();
    });

    await test.step('9) Verify the expected redirect (homepage)', async () => {
        const isHome = await homePage.isHomePageExists();
        expect(isHome).toBeTruthy();
    });

    await test.step('10) Verify that authenticated account options are no longer available', async () => {
        await homePage.openMyAccountMenu();
        const isLoggedOut = await homePage.isLoggedOut();
        expect(isLoggedOut).toBeTruthy();
    });

    console.log('✅ ✔️ Logout flow completed successfully!');
});