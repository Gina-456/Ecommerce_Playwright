import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

test.describe('Products API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);

    // ---------------------------------------------------------
    // GET - All Products
    // ---------------------------------------------------------

    test('GET - All products @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);

        // Validate important fields on each product
        const firstProduct = responseBody[0];
        expect(firstProduct.id).toBeTruthy();
        expect(typeof firstProduct.title).toBe('string');
        expect(typeof firstProduct.price).toBe('number');
        expect(typeof firstProduct.category).toBe('string');
        expect(typeof firstProduct.image).toBe('string');
    });

    // ---------------------------------------------------------
    // GET - Product by ID
    // ---------------------------------------------------------

    test('GET - Product by ID @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.id, `Returned id ${responseBody.id} should match requested id ${PRODUCT_ID}`).toBe(PRODUCT_ID);
        expect(responseBody.title).toBeTruthy();
        expect(typeof responseBody.price).toBe('number');
        expect(typeof responseBody.category).toBe('string');
        expect(typeof responseBody.image).toBe('string');
    });

    // ---------------------------------------------------------
    // GET - Products with Limit
    // ---------------------------------------------------------

    test('GET - Products with limit @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCTS_WITH_LIMIT.replace('{limit}', String(LIMIT))}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length, `Expected ${LIMIT} products, got ${responseBody.length}`).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Sort Products Ascending
    // ---------------------------------------------------------

    test('GET - Sort products ascending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'asc')}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        const ids = responseBody.map((p: { id: number }) => p.id);
        const sortedIds = [...ids].sort((a, b) => a - b);

        expect(ids, 'Product IDs should be in ascending order').toEqual(sortedIds);
    });

    // ---------------------------------------------------------
    // GET - Sort Products Descending
    // ---------------------------------------------------------

    test('GET - Sort products descending @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCTS_SORTED.replace('{order}', 'desc')}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        const ids = responseBody.map((p: { id: number }) => p.id);
        const sortedIds = [...ids].sort((a, b) => b - a);

        expect(ids, 'Product IDs should be in descending order').toEqual(sortedIds);
    });

    // ---------------------------------------------------------
    // GET - All Product Categories
    // ---------------------------------------------------------

    test('GET - All product categories @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CATEGORIES}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);
        expect(responseBody.every((c: unknown) => typeof c === 'string')).toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Products by Category
    // ---------------------------------------------------------

    test('GET - Products by category @master @regression @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCTS_BY_CATEGORY.replace('{category}', 'electronics')}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);
        responseBody.forEach((p: { category: string }) => {
            expect(p.category, 'Every product should belong to the requested category').toBe('electronics');
        });
    });

    // ---------------------------------------------------------
    // POST - Create Product
    // ---------------------------------------------------------

    test('POST - Create product @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateProductPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });

        expect(response.status()).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.id, 'Created product should return an ID').toBeTruthy();
        expect(responseBody.title, 'Returned title should match submitted title').toBe(payload.title);
        expect(responseBody.price, 'Returned price should match submitted price').toBe(payload.price);
        expect(responseBody.category, 'Returned category should match submitted category').toBe(payload.category);
    });

    // ---------------------------------------------------------
    // PUT - Update Product
    // ---------------------------------------------------------

    test('PUT - Update product @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUpdatedProductPayload();

        const response = await request.put(`${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(PRODUCT_ID))}`, { data: payload });

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.id, `Returned id ${responseBody.id} should match requested id ${PRODUCT_ID}`).toBe(PRODUCT_ID);
        expect(responseBody.title, 'Returned title should reflect the updated value').toBe(payload.title);
        expect(responseBody.price, 'Returned price should reflect the updated value').toBe(payload.price);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Product
    // ---------------------------------------------------------

    test('DELETE - Delete product @master @regression @api', async ({ request }) => {

        const response = await request.delete(`${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(PRODUCT_ID))}`);

        expect(response.status()).toBe(200);

        // Validate the response body is present and parses to JSON
        const responseBody = await response.json();
        expect(responseBody, 'Delete response should contain a body').toBeTruthy();
    });
});