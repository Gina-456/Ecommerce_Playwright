/**
 * Test Case: User Registration Flow
 *
 * Tags: @master @smoke @regression
 *
 * Steps:
 * 1) Open the application
 * 2) Navigate to My Account → Register
 * 3) Verify that the registration page is displayed
 * 4) Generate a unique customer email
 * 5) Enter valid values (first name, last name, email, telephone, password, confirm)
 * 6) Accept the Privacy Policy
 * 7) Submit the registration form
 * 8) Verify that registration succeeds
 * 9) Verify the account-created confirmation message "Your Account Has Been Created!"
 * 10) Verify the new account is available through the account navigation
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import type { RegisterPage } from '../../pages/RegisterPage';
import { Helper } from '../../utils/helper';

test('User registration flow test @master @smoke @regression', async ({ homePage, accountPage }) => {
    const customer = Helper.generateCustomerData();
    let registerPage: RegisterPage;

    await test.step('1) Open the application', async () => {
        const isHome = await homePage.isHomePageExists();
        expect(isHome).toBeTruthy();
    });

    await test.step('2) Navigate to My Account → Register', async () => {
        registerPage = await homePage.goToRegisterPage();
    });

    await test.step('3) Verify that the registration page is displayed', async () => {
        const isRegister = await registerPage.isRegisterPageExists();
        expect(isRegister).toBeTruthy();
    });

    await test.step('4) Generate a unique customer email', async () => {
        expect(customer.email).toBeTruthy();
        expect(customer.email).toContain('@');
    });

    await test.step('5) Enter valid values (first name, last name, email, telephone, password, confirm)', async () => {
        await registerPage.fillRegistrationForm(customer);
    });

    await test.step('6) Accept the Privacy Policy', async () => {
        await registerPage.acceptPrivacyPolicy();
    });

    await test.step('7) Submit the registration form', async () => {
        await registerPage.submitRegistration();
    });

    await test.step('8) Verify that registration succeeds', async () => {
        const isAccountCreated = await accountPage.isAccountCreatedPageExists();
        expect(isAccountCreated).toBeTruthy();
    });

    await test.step('9) Verify the account-created confirmation message', async () => {
        const confirmationText = await accountPage.getAccountCreatedHeadingText();
        expect(confirmationText).toBe('Your Account Has Been Created!');
    });

    await test.step('10) Verify the new account is available through the account navigation', async () => {
        await accountPage.clickContinue();
        const isAccount = await accountPage.isMyAccountExists();
        expect(isAccount).toBeTruthy();
    });

    console.log('✅ ✔️ Registration flow completed successfully!');
});