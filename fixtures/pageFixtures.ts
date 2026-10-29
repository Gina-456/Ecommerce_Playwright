import { test as base } from '@playwright/test';
import dotenv from 'dotenv';

import { HomePage } from '../pages/HomePage';
import { RegisterPage } from '../pages/RegisterPage';
import { AccountPage } from '../pages/AccountPage';
import { LogoutPage } from '../pages/LogoutPage';
import { LoginPage } from '../pages/LoginPage';
import { SearchResultsPage } from '../pages/SearchResultsPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { AdminCustomersPage } from '../pages/AdminCustomersPage';

dotenv.config();

const APP_URL = process.env.WEB_APP_URL || 'http://localhost/opencart/upload/';

type PageFixtures = {
    homePage: HomePage;
    registerPage: RegisterPage;
    accountPage: AccountPage;
    logoutPage: LogoutPage;
    loginPage: LoginPage;
    searchResultsPage: SearchResultsPage;
    productPage: ProductPage;
    cartPage: CartPage;
    adminLoginPage: AdminLoginPage;
    adminDashboardPage: AdminDashboardPage;
    adminCustomersPage: AdminCustomersPage;
};

export const test = base.extend<PageFixtures>({
    // Entry-point fixture: navigates to the application URL
    homePage: async ({ page }, use) => {
        await page.goto(APP_URL);
        await use(new HomePage(page));
    },
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
    accountPage: async ({ page }, use) => {
        await use(new AccountPage(page));
    },
    logoutPage: async ({ page }, use) => {
        await use(new LogoutPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    searchResultsPage: async ({ page }, use) => {
        await use(new SearchResultsPage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    adminLoginPage: async ({ page }, use) => {
        await use(new AdminLoginPage(page));
    },
    adminDashboardPage: async ({ page }, use) => {
        await use(new AdminDashboardPage(page));
    },
    adminCustomersPage: async ({ page }, use) => {
        await use(new AdminCustomersPage(page));
    },
});

test.afterEach(async ({ page, context }) => {
    if (page && !page.isClosed()) {
        await page.close();
    }
    if (context && !context.pages().length) {
        await context.close();
    }
});

export { expect } from '@playwright/test';