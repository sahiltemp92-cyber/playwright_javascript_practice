import { test, expect, request } from "@playwright/test";
import { APIUtils } from "../utils/APIUtils"
const URL = "https://rahulshettyacademy.com/api/ecom/auth/login"
const loginPayload = {
    userEmail: "sahil.khenat.career@gmail.com",
    userPassword: "Rahul@12345"
}
const orderPayload = {
    orders: [
        {
            country: "India",
            productOrderedId: "6960eac0c941646b7a8b3e68"
        }
    ]
}

let response;

test.beforeAll(async () => {
    const apiContext = await request.newContext()
    const apiUtils = new APIUtils(apiContext, loginPayload)
    response = await apiUtils.createOrder(orderPayload)

}
)

test.beforeEach(() => {

}
)

test.afterEach(() => {

}
)

test.afterAll(() => {

}
)

test.only("Create Order by API and validate order from UI", async ({ page }) => {
    // Script to add token in localstorage before page load
    page.addInitScript(async (value) => {
        window.localStorage.setItem("token", value);
    }, response.token)

    await page.goto("https://rahulshettyacademy.com/client/")
    await page.locator("[routerlink='/dashboard/myorders']").first().click()
    await page.locator("tbody").waitFor()

    const rows = page.locator("tbody tr")

    for (let i = 0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator("th").textContent()
        if (response.orderID.includes(rowOrderId)) {
            await rows.nth(i).locator("button").first().click()
            break;
        }
    }
    const orderIdDetails = await page.locator(".col-text").textContent()
    console.log("Order Details :" + orderIdDetails)
    expect(orderIdDetails.includes(response.orderID)).toBe(true)
}
)
