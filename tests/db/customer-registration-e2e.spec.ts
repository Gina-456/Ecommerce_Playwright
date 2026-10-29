/**
 * Test Case: End-to-End Customer Registration — Frontend + Admin + Database
 *
 * Tags: @master @end-to-end @db @regression
 *
 * Steps:
 * 1) Register a Customer Through the Frontend
 * 2) Verify the Customer in the Admin Portal
 * 3) Verify the Customer in MySQL (oc_customer table)
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { executeQuery } from '../../utils/dbClient';
import { Helper } from '../../utils/helper';
import { AdminLoginPage } from '../../pages/AdminLoginPage';
import type { AccountPage } from '../../pages/AccountPage';
import type { RegisterPage } from '../../pages/RegisterPage';

// ---------------------------------------------------------
// Configuration
// ---------------------------------------------------------

const ADMIN_URL = 'http://localhost/opencart/upload/admin/index.php';

// ---------------------------------------------------------
// End-to-End Test
// ---------------------------------------------------------

test('Customer registration — frontend, admin & DB validation @master @end-to-end @db @regression', async ({ browser, homePage }) => {
    // Generate unique customer data once, used across all three layers
    const customer = Helper.generateCustomerData();

    // ═══════════════════════════════════════════════════════
    // Step 1: Register a Customer Through the Frontend
    // ═══════════════════════════════════════════════════════

    let accountPg: AccountPage;

    await test.step('1a) Open the application', async () => {
        const isHome = await homePage.isHomePageExists();
        expect(isHome).toBeTruthy();
    });

    await test.step('1b) Navigate to My Account → Register and fill the form', async () => {
        const registerPage: RegisterPage = await homePage.goToRegisterPage();
        const isRegister = await registerPage.isRegisterPageExists();
        expect(isRegister).toBeTruthy();
        await registerPage.fillRegistrationForm(customer);
        await registerPage.acceptPrivacyPolicy();
        accountPg = await registerPage.submitRegistration();
    });

    await test.step('1c) Verify registration succeeded', async () => {
        const isAccountCreated = await accountPg.isAccountCreatedPageExists();
        expect(isAccountCreated).toBeTruthy();
        const confirmationText = await accountPg.getAccountCreatedHeadingText();
        expect(confirmationText).toBe('Your Account Has Been Created!');
    });

    // Store the customer data for later verification steps
    console.log(`✅ Registered customer: ${customer.firstName} ${customer.lastName} <${customer.email}>`);

    // ═══════════════════════════════════════════════════════
    // Step 2: Verify the Customer in the Admin Portal
    // ═══════════════════════════════════════════════════════
    //
    // The admin portal runs under a separate session, so we create a
    // dedicated browser context and page for the admin steps.

    await test.step('2a) Open the admin portal and log in', async () => {
        const adminContext = await browser.newContext();
        const adminPage = await adminContext.newPage();

        try {
            // Navigate to admin login and authenticate
            const adminLoginPage = new AdminLoginPage(adminPage);
            await adminLoginPage.goto();
            await adminPage.waitForLoadState('networkidle');

            const isLogin = await adminLoginPage.isLoginPageExists();
            expect(isLogin).toBeTruthy();

            const adminDashboard = await adminLoginPage.login(
                process.env.ADMIN_USERNAME || 'admin',
                process.env.ADMIN_PASSWORD || 'admin'
            );
            const isDashboard = await adminDashboard.isDashboardExists();
            expect(isDashboard).toBeTruthy();

            // Navigate to Customers section
            const adminCustomersPage = await adminDashboard.goToCustomers();
            const isCustomersPage = await adminCustomersPage.isCustomersPageExists();
            expect(isCustomersPage).toBeTruthy();

            // Search for the newly registered customer by email
            await adminCustomersPage.filterByEmail(customer.email);

            // Verify the customer appears in the list
            const isFound = await adminCustomersPage.isCustomerInList(customer.email);
            expect(isFound).toBeTruthy();

            // Validate first name and last name appear in the name column
            const displayedName = await adminCustomersPage.getCustomerNameByEmail(customer.email);
            expect(displayedName).toBeTruthy();
            expect(displayedName!.toLowerCase()).toContain(customer.firstName.toLowerCase());
            expect(displayedName!.toLowerCase()).toContain(customer.lastName.toLowerCase());

            // Validate the customer status is "Enabled"
            const status = await adminCustomersPage.getCustomerStatusByEmail(customer.email);
            expect(status?.toLowerCase()).toBe('enabled');

            console.log(`✅ Admin portal verified customer: ${displayedName}`);
        } finally {
            await adminContext.close();
        }
    });

    // ═══════════════════════════════════════════════════════
    // Step 3: Verify the Customer in MySQL (oc_customer)
    // ═══════════════════════════════════════════════════════

    await test.step('3a) Query oc_customer for the registered email', async () => {
        const rows: any[] = await executeQuery(
            "SELECT customer_id, firstname, lastname, email, status, date_added FROM oc_customer WHERE email = ?",
            [customer.email]
        );

        // Verify exactly one record is found
        expect(rows.length).toBe(1);

        const record = rows[0];

        // Verify firstname matches
        expect(record.firstname).toBe(customer.firstName);

        // Verify lastname matches
        expect(record.lastname).toBe(customer.lastName);

        // Verify email matches
        expect(record.email).toBe(customer.email);

        // Verify status is 1 (Enabled)
        expect(record.status).toBe(1);

        // Verify date_added exists
        expect(record.date_added).toBeTruthy();

        console.log(`✅ Database verified: ${record.firstname} ${record.lastname} <${record.email}> (ID: ${record.customer_id})`);
    });

    // ═══════════════════════════════════════════════════════
    // Cleanup: Delete the registered customer from DB
    // ═══════════════════════════════════════════════════════

    await test.step('Cleanup) Remove the test customer from the database', async () => {
        await executeQuery("DELETE FROM oc_customer WHERE email = ?", [customer.email]);
        console.log(`✅ Cleanup: removed customer ${customer.email}`);
    });

    console.log('✅ ✔️ Customer registration end-to-end test completed successfully!');
});