import { test, expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import dotenv from 'dotenv';

dotenv.config();

// ------------------------------------------------------------------
// Product CRUD Workflow
// ------------------------------------------------------------------

test.describe.serial('Product CRUD Workflow', () => {

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USER_ID = Number(process.env.USER_ID ?? 1);

    let productId: number;

    test('Create -> Update -> Delete product @master @smoke @api @end-to-end', async ({ request }) => {

        // 1) Create a product
        const createPayload = RandomDataUtil.generateProductPayload();
        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: createPayload });

        expect(createResponse.status(), `Expected status 201, got ${createResponse.status()}`).toBe(201);

        const created = await createResponse.json();
        expect(created.id, 'Created product should return an ID').toBeTruthy();
        productId = created.id;

        // 2) Update the same product
        const updatePayload = RandomDataUtil.generateUpdatedProductPayload();
        updatePayload.title = `Updated ${createPayload.title}`;
        const updateResponse = await request.put(
            `${BASE_URL}${Routes.UPDATE_PRODUCT.replace('{id}', String(productId))}`,
            { data: updatePayload }
        );

        expect(updateResponse.status(), `Expected status 200, got ${updateResponse.status()}`).toBe(200);

        const updated = await updateResponse.json();
        expect(updated.id, 'Updated product should keep the same ID').toBe(productId);
        expect(updated.title, 'Updated title should reflect the updated value').toBe(updatePayload.title);

        // 3) Delete the same product
        const deleteResponse = await request.delete(`${BASE_URL}${Routes.DELETE_PRODUCT.replace('{id}', String(productId))}`);

        expect(deleteResponse.status(), `Expected status 200, got ${deleteResponse.status()}`).toBe(200);
    });
});

// ------------------------------------------------------------------
// User CRUD Workflow
// ------------------------------------------------------------------

test.describe.serial('User CRUD Workflow', () => {

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;

    let userId: number;

    test('Create -> Update -> Delete user @master @smoke @api @end-to-end', async ({ request }) => {

        // 1) Create a user
        const createPayload = RandomDataUtil.generateUserPayload();
        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: createPayload });

        expect(createResponse.status(), `Expected status 201, got ${createResponse.status()}`).toBe(201);

        const created = await createResponse.json();
        expect(created.id, 'Created user should return an ID').toBeTruthy();
        userId = created.id;

        // 2) Update the same user
        const updatePayload = RandomDataUtil.generateUserUpdatePayload();
        const updateResponse = await request.put(
            `${BASE_URL}${Routes.UPDATE_USER.replace('{id}', String(userId))}`,
            { data: updatePayload }
        );

        expect(updateResponse.status(), `Expected status 200, got ${updateResponse.status()}`).toBe(200);

        const updated = await updateResponse.json();
        expect(updated.username, 'Updated username should reflect the updated value').toBe(updatePayload.username);
        expect(updated.email, 'Updated email should reflect the updated value').toBe(updatePayload.email);

        // 3) Delete the same user
        const deleteResponse = await request.delete(`${BASE_URL}${Routes.DELETE_USER.replace('{id}', String(userId))}`);

        expect(deleteResponse.status(), `Expected status 200, got ${deleteResponse.status()}`).toBe(200);
    });
});

// ------------------------------------------------------------------
// Cart CRUD Workflow
// ------------------------------------------------------------------

test.describe.serial('Cart CRUD Workflow', () => {

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USER_ID = Number(process.env.USER_ID ?? 1);

    let cartId: number;

    test('Create -> Update -> Delete cart @master @smoke @api @end-to-end', async ({ request }) => {

        // 1) Create a cart
        const createPayload = RandomDataUtil.generateCartPayload(USER_ID);
        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: createPayload });

        expect(createResponse.status(), `Expected status 201, got ${createResponse.status()}`).toBe(201);

        const created = await createResponse.json();
        expect(created.id, 'Created cart should return an ID').toBeTruthy();
        cartId = created.id;
        expect(created.userId, 'Returned userId should match submitted userId').toBe(USER_ID);
        expect(created.products, 'Returned products should match submitted products').toEqual(createPayload.products);

        // 2) Update the same cart (change a quantity)
        const updatePayload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
        updatePayload.products[0].quantity = updatePayload.products[0].quantity + 1;
        const updateResponse = await request.put(
            `${BASE_URL}${Routes.UPDATE_CART.replace('{id}', String(cartId))}`,
            { data: updatePayload }
        );

        expect(updateResponse.status(), `Expected status 200, got ${updateResponse.status()}`).toBe(200);

        const updated = await updateResponse.json();
        expect(updated.id, 'Updated cart should keep the same ID').toBe(cartId);
        expect(updated.products[0].quantity, 'Updated quantity should reflect the requested change')
            .toBe(updatePayload.products[0].quantity);

        // 3) Delete the same cart
        const deleteResponse = await request.delete(`${BASE_URL}${Routes.DELETE_CART.replace('{id}', String(cartId))}`);

        expect(deleteResponse.status(), `Expected status 200, got ${deleteResponse.status()}`).toBe(200);
    });
});