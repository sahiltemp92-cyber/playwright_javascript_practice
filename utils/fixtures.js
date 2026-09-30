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

