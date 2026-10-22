import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import { Routes } from '../../api/endpoints/routes';
import { DataProvider } from '../../utils/DataReader';
import dotenv from 'dotenv';

dotenv.config();

test.describe('JSON Schema Validation API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const CART_ID = Number(process.env.CART_ID ?? 1);

    const ajv = new Ajv();

    // ---------------------------------------------------------
    // Product Response Schema
    // ---------------------------------------------------------

    test('Product response matches JSON schema @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID))}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        const schema = DataProvider.readJson('api/schemas/product_api_schema.json');

        const validate = ajv.compile(schema);
        const isValid = validate(responseBody);

        if (!isValid) {
            console.log('Product schema validation errors:', JSON.stringify(validate.errors, null, 2));
        }

        expect(isValid, 'Product response should conform to the expected JSON schema').toBeTruthy();
    });

    // ---------------------------------------------------------
    // User Response Schema
    // ---------------------------------------------------------

    test('User response matches JSON schema @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID))}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        const schema = DataProvider.readJson('api/schemas/user_api_schema.json');

        const validate = ajv.compile(schema);
        const isValid = validate(responseBody);

        if (!isValid) {
            console.log('User schema validation errors:', JSON.stringify(validate.errors, null, 2));
        }

        expect(isValid, 'User response should conform to the expected JSON schema').toBeTruthy();
    });

    // ---------------------------------------------------------
    // Cart Response Schema
    // ---------------------------------------------------------

    test('Cart response matches JSON schema @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID))}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        const schema = DataProvider.readJson('api/schemas/cart_api_schema.json');

        const validate = ajv.compile(schema);
        const isValid = validate(responseBody);

        if (!isValid) {
            console.log('Cart schema validation errors:', JSON.stringify(validate.errors, null, 2));
        }

        expect(isValid, 'Cart response should conform to the expected JSON schema').toBeTruthy();
    });
});