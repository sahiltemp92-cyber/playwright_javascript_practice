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
const fakePayloadOrders = {
    data: [],
    message: "No Orders"
}

let response;

test.beforeAll(async () => {
    const apiContext = await request.newContext()
    const apiUtils = new APIUtils(apiContext, loginPayload)
    response = await apiUtils.createOrder(orderPayload)
}
)

test.only("Create Order by API and validate order from UI", async ({ page }) => {
    // Script to add token in localstorage before page load
    page.addInitScript(async (value) => {
        window.localStorage.setItem("token", value);
    }, response.token)

    const routeURL = "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*"
    await page.route(routeURL,
        async route => {
            //Intercept Response - API response - Playwright Fake Response
            await page.request.fetch(route.request())
            let body = JSON.stringify(fakePayloadOrders)
            route.fulfill(
                {
                    response,
                    body
                }
            )
        }

    )

    await page.goto("https://rahulshettyacademy.com/client/")
    await page.pause()

    await page.locator("[routerlink='/dashboard/myorders']").first().click()
    await page.waitForResponse(routeURL)
    const rows = page.locator("tbody tr")
    console.log(`Number of orders is : ${await rows.count()}`)
}
)
