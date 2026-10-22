/**
 * Test Case: Login Flow (Data Driven using External File)
 *
 * Tags: @master @regression @datadriven
 *
 * Steps (per data row):
 * 1) Open the OpenCart login page
 * 2) Enter the email and password (blank fields stay empty)
 * 3) Submit the login form
 * 4) Validate the result based on `expected`
 *    - success: login succeeds and the My Account page is displayed
 *    - failure: login is rejected and the expected warning is displayed
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { executeQuery } from '../../utils/dbClient';
import { DataProvider } from '../../utils/DataReader';

interface LoginRow {
    testName: string;
    email: string;
    password: string;
    expected: string;
}

const loginData = DataProvider.readJson('testdata/opencart_logindata.json') as LoginRow[];

// OpenCart throttles login attempts (5 per email/IP per hour). Reset the
// attempts table before each test so invalid-row results are deterministic.
test.beforeEach(async () => {
    await executeQuery('DELETE FROM oc_customer_login');
});

for (const [index, row] of loginData.entries()) {
    test(`Data-driven login (${index + 1}): ${row.testName} @master @regression @datadriven`, async ({ homePage, loginPage, accountPage }) => {
        await test.step('1) Open the OpenCart login page', async () => {
            const isHome = await homePage.isHomePageExists();
            expect(isHome).toBeTruthy();
            await homePage.goToLoginPage();
            const isLogin = await loginPage.isLoginPageExists();
            expect(isLogin).toBeTruthy();
        });

        await test.step('2) Enter the email and password (blank fields stay empty)', async () => {
            const email = row.email.trim();
            const password = row.password.trim();
            await loginPage.fillCredentials(email, password);
        });

        await test.step('3) Submit the login form', async () => {
            await loginPage.clickLoginButton();
        });

        await test.step('4) Validate the result based on expected value', async () => {
            if (row.expected === 'success') {
                const isAccount = await accountPage.isMyAccountExists();
                expect(isAccount).toBeTruthy();
            } else {
                const isAccount = await accountPage.isMyAccountExists();
                expect(isAccount).toBeFalsy();
                const isWarning = await loginPage.isLoginWarningVisible('Warning: No match for E-Mail Address and/or Password.');
                expect(isWarning).toBeTruthy();
            }
        });

        console.log(`✅ ✔️ Data-driven login "${row.testName}" completed successfully!`);
    });
}