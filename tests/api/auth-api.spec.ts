import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Authentication API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
        // Use dedicated API credentials (USERNAME collides with the Windows
        // built-in USERNAME env var that dotenv will not override).
        const USERNAME = process.env.API_USERNAME || 'mor_2314';
        const PASSWORD = process.env.API_PASSWORD || '83r5^_';

    // ---------------------------------------------------------
    // POST - Successful Login
    // ---------------------------------------------------------

    test('POST - Login with valid credentials @master @sanity @api', async ({ request }) => {

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: {
                username: USERNAME,
                password: PASSWORD
            }
        });

        expect(response.status(), `Expected status 201, got ${response.status()}`).toBe(201);

        const responseBody = await response.json();

        // Verify a token is returned
        expect(responseBody.token, 'Response should contain a token').toBeTruthy();
        expect(typeof responseBody.token, 'Token should be a string').toBe('string');
        expect(responseBody.token.length, 'Token should be a non-empty string').toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // POST - Invalid Login
    // ---------------------------------------------------------

    test('POST - Login with invalid credentials @master @regression @api', async ({ request }) => {

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: {
                username: 'invalid.user@example.com',
                password: 'wrong-password'
            }
        });

        expect(response.status(), `Expected status 401, got ${response.status()}`).toBe(401);

                // The login error body is plain text, not JSON
                const responseBody = await response.text();

                expect(responseBody, 'Response should contain the error message').toBeTruthy();
                expect(responseBody, 'Login error message mismatch').toBe('username or password is incorrect');
    });
});