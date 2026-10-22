import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Carts API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const CART_ID = Number(process.env.CART_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);
    const START_DATE = process.env.START_DATE || '2019-12-10';
    const END_DATE = process.env.END_DATE || '2020-10-10';

    // ---------------------------------------------------------
    // GET - All Carts
    // ---------------------------------------------------------

    test('GET - All carts @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CARTS}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // GET - Cart by ID
    // ---------------------------------------------------------

    test('GET - Cart by ID @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.id, `Returned id ${responseBody.id} should match requested id ${CART_ID}`).toBe(CART_ID);
        expect(responseBody.userId).toBeTruthy();
        expect(Array.isArray(responseBody.products)).toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Carts by Date Range
    // ---------------------------------------------------------

    test('GET - Carts by date range @master @regression @api', async ({ request }) => {

        const url = `${BASE_URL}${Routes.GET_CARTS_BY_DATE_RANGE
            .replace('{startdate}', START_DATE)
            .replace('{enddate}', END_DATE)}`;

        const response = await request.get(url);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);

        // Verify each returned cart falls within the requested date range
        const start = new Date(START_DATE).getTime();
        const end = new Date(END_DATE).getTime();
        responseBody.forEach((cart: { date: string }) => {
            const cartDate = new Date(cart.date).getTime();
            expect(cartDate, `Cart date ${cart.date} should fall within the requested range`).toBeGreaterThanOrEqual(start);
            expect(cartDate, `Cart date ${cart.date} should fall within the requested range`).toBeLessThanOrEqual(end);
        });
    });

    // ---------------------------------------------------------
    // GET - User Cart
    // ---------------------------------------------------------

    test('GET - User cart @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USER_CART.replace('{userId}', String(USER_ID))}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();

        // Verify returned carts belong to the requested user
        responseBody.forEach((cart: { userId: number }) => {
            expect(cart.userId, 'Each returned cart should belong to the requested user').toBe(USER_ID);
        });
    });

    // ---------------------------------------------------------
    // GET - Carts with Limit
    // ---------------------------------------------------------

    test('GET - Carts with limit @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_CARTS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length, `Expected ${LIMIT} carts, got ${responseBody.length}`).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Sort Carts Ascending
    // ---------------------------------------------------------

    test('GET - Sort carts ascending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', 'asc')}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        const ids = responseBody.map((c: { id: number }) => c.id);
        const sortedIds = [...ids].sort((a, b) => a - b);

        expect(ids, 'Cart IDs should be in ascending order').toEqual(sortedIds);
    });

    // ---------------------------------------------------------
    // GET - Sort Carts Descending
    // ---------------------------------------------------------

    test('GET - Sort carts descending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_CARTS_SORTED.replace('{order}', 'desc')}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        const ids = responseBody.map((c: { id: number }) => c.id);
        const sortedIds = [...ids].sort((a, b) => b - a);

        expect(ids, 'Cart IDs should be in descending order').toEqual(sortedIds);
    });

    // ---------------------------------------------------------
    // POST - Create Cart
    // ---------------------------------------------------------

    test('POST - Create cart @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateCartPayload(USER_ID);

        const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });

        expect(response.status()).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.id, 'Created cart should return an ID').toBeTruthy();
        expect(responseBody.userId, 'Returned userId should match submitted userId').toBe(USER_ID);
        expect(responseBody.products, 'Returned products should match submitted products').toEqual(payload.products);
    });

    // ---------------------------------------------------------
    // PUT - Update Cart
    // ---------------------------------------------------------

    test('PUT - Update cart (change quantity) @master @regression @api', async ({ request }) => {

        // Build an updated cart with a changed product quantity
        const payload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
        // Ensure at least one quantity differs from the original by design
        payload.products[0].quantity = payload.products[0].quantity + 1;

        const response = await request.put(`${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(CART_ID))}`, { data: payload });

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.id, `Returned id ${responseBody.id} should match requested id ${CART_ID}`).toBe(CART_ID);
        expect(responseBody.products[0].quantity, 'Returned quantity should reflect the updated value')
            .toBe(payload.products[0].quantity);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Cart
    // ---------------------------------------------------------

    test('DELETE - Delete cart @master @regression @api', async ({ request }) => {

        const response = await request.delete(`${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(CART_ID))}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        expect(responseBody, 'Delete response should contain a body').toBeTruthy();
    });
});