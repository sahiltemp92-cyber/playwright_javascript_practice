import { test, request } from "@playwright/test"
import { APIUtils } from "./APIUtils"
const loginPayload = { userEmail: 'sahil.khenat.career@gmail.com', userPassword: "Rahul@12345" }
const orderPayload = {
    orders: [{
        country: "India",
        productOrderedId: "6960eac0c941646b7a8b3e68"
    }]
}

exports.customtest = test.extend({
    authenticatedPage: async ({ browser }, use) => {
        // Setup
        const context = await browser.newContext()
        const page = await context.newPage()
        await page.goto("https://rahulshettyacademy.com/client")
        await page.locator("[type='email']").fill(loginPayload.userEmail)
        await page.locator("[type='password']").fill(loginPayload.userPassword)
        await page.locator("[name='login']").click()
        await page.waitForLoadState("domcontentloaded")

        await use(page)

        // Tear Down
        await context.close()
    },

    createOrder: async ({ }, use) => {
        const apiContext = await request.newContext()
        const apiUtils = new APIUtils(apiContext, loginPayload)
        let response = await apiUtils.createOrder(orderPayload)
        await use(response)
    },

    testDataForOrder: { productName: "ADIDAS ORIGINAL" }
})

const base = require('@playwright/test');
const { expect } = base;

const LOGIN_URL = 'https://eventhub.rahulshettyacademy.com/login';
const API_BASE_URL = 'https://api.eventhub.rahulshettyacademy.com';

const credentials = {
    email: 'rahulshetty1@yahoo.com',
    password: 'Magiclife1!',
};

exports.eventTest = base.test.extend({

    // Task 1: UI login fixture — returns an already-authenticated page
    eventAuthenticatedPage: async ({ browser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto(LOGIN_URL);
        await page.getByPlaceholder('you@email.com').fill(credentials.email);
        await page.getByLabel('Password').fill(credentials.password);
        await page.locator('#login-btn').click();
        await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();

        await use(page);
        await context.close();
    },

    // Task 2: API event-creation fixture — returns the created event's data
    createEvent: async ({ playwright }, use) => {
        const apiContext = await playwright.request.newContext({ baseURL: API_BASE_URL });

        // confirmed response shape: { success, token, user: { id, email } }
        const loginRes = await apiContext.post('/api/auth/login', {
            data: {
                email: credentials.email,
                password: credentials.password
            }
        });
        const loginBody = await loginRes.json();
        const token = loginBody.token;

        const eventPayload = {
            title: `Automation Test Event ${Date.now()}`,
            description: 'Created by an automated Playwright fixture for testing.',
            category: 'Conference',
            venue: 'Bangalore International Centre',
            city: 'Bangalore',
            eventDate: new Date(Date.now() + 86400000 * 30).toISOString(),
            price: 1500,
            totalSeats: 500,
            imageUrl: 'https://example.com/images/automation-event.jpg',
        };

        const createRes = await apiContext.post('/api/events', {
            data: eventPayload,
            headers: { Authorization: `Bearer ${token}` },
        });
        const body = await createRes.json();
        const event = body.data || body;

        await use(event);

        // teardown — clean up the event after the test finishes
        if (event && event.id) {
            await apiContext.delete(`/api/events/${event.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
        }
        await apiContext.dispose();
    },
});

exports.expect = expect;
