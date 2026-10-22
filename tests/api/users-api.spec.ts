import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Users API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);

    // ---------------------------------------------------------
    // GET - All Users
    // ---------------------------------------------------------

    test('GET - All users @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_USERS}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // GET - User by ID
    // ---------------------------------------------------------

    test('GET - User by ID @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.id, `Returned id ${responseBody.id} should match requested id ${USER_ID}`).toBe(USER_ID);
        expect(responseBody.email).toBeTruthy();
        expect(responseBody.name).toBeTruthy();
        expect(typeof responseBody.name.firstname).toBe('string');
        expect(typeof responseBody.name.lastname).toBe('string');
    });

    // ---------------------------------------------------------
    // GET - Users with Limit
    // ---------------------------------------------------------

    test('GET - Users with limit @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USERS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length, `Expected ${LIMIT} users, got ${responseBody.length}`).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Sort Users Ascending
    // ---------------------------------------------------------

    test('GET - Sort users ascending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USERS_SORTED.replace('{order}', 'asc')}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        const ids = responseBody.map((u: { id: number }) => u.id);
        const sortedIds = [...ids].sort((a, b) => a - b);

        expect(ids, 'User IDs should be in ascending order').toEqual(sortedIds);
    });

    // ---------------------------------------------------------
    // GET - Sort Users Descending
    // ---------------------------------------------------------

    test('GET - Sort users descending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USERS_SORTED.replace('{order}', 'desc')}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        const ids = responseBody.map((u: { id: number }) => u.id);
        const sortedIds = [...ids].sort((a, b) => b - a);

        expect(ids, 'User IDs should be in descending order').toEqual(sortedIds);
    });

    // ---------------------------------------------------------
    // POST - Create User
    // ---------------------------------------------------------

    test('POST - Create user @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUserPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: payload });

        expect(response.status()).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.id, 'Created user should return an ID').toBeTruthy();
    });

    // ---------------------------------------------------------
    // PUT - Update User
    // ---------------------------------------------------------

    test('PUT - Update user @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUserUpdatePayload();

        const response = await request.put(`${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(USER_ID))}`, { data: payload });

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.username, 'Returned username should reflect the updated value').toBe(payload.username);
        expect(responseBody.email, 'Returned email should reflect the updated value').toBe(payload.email);
        expect(responseBody.name.firstname, 'Returned first name should reflect the updated value').toBe(payload.name.firstname);
    });

    // ---------------------------------------------------------
    // DELETE - Delete User
    // ---------------------------------------------------------

    test('DELETE - Delete user @master @regression @api', async ({ request }) => {

        const response = await request.delete(`${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(USER_ID))}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody, 'Delete response should contain a body').toBeTruthy();
    });
});