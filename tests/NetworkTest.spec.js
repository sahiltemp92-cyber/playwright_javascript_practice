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

test("Response Interception - Fake number of orders to zero to validate no orders message", async ({ page }) => {
    // Script to add token in localstorage before page load
    page.addInitScript(async (value) => {
        window.localStorage.setItem("token", value);
    }, response.token)

    const routeURL = "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*"
    await page.route(routeURL,
        async route => {
            //Intercept Response - API response - Playwright Fake Response
            await page.request.fetch(route.request())

            // Modify body
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
    await page.locator("[routerlink='/dashboard/myorders']").first().click()
    await page.waitForResponse(routeURL)
    const rows = page.locator("tbody tr")
    console.log(`Number of orders is : ${await rows.count()}`)
}
)


test("Request Interception - Security test - Verify unauthorized message is displayed", async ({ page }) => {
    // Login
    await page.goto("https://rahulshettyacademy.com/client")
    await page.locator("[type='email']").fill("sahil.khenat.career@gmail.com")
    await page.locator("[type='password']").fill("Rahul@12345")
    await page.locator("[type='submit']").click()
    await page.waitForURL("https://rahulshettyacademy.com/client/#/dashboard/dash")
    await page.locator("[routerlink='/dashboard/myorders']").first().click()

    const ordersURL = "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*"
    const otherAccountOrderId = "6aba09292be7a4bc2b74c920"
    const routedURL = `${ordersURL.slice(0, -1)}${otherAccountOrderId}`
    console.log(routedURL)

    // Routing logic - Request interception
    await page.route(ordersURL,
        route => route.continue({ url: routedURL })
    )

    // Action
    await page.getByRole("button", { name: "View" }).first().click()

    // Assertion
    const unauthorizedMessage = await page.locator("p.blink_me").textContent()
    expect(unauthorizedMessage).toContain("You are not authorize to view this order")
})

test('Request Abort - CSS Break', async ({ page }) => {
    // Before Login - disable CSS
    await page.route("**/*.css", route => route.abort())


    // Login
    await page.goto("https://rahulshettyacademy.com/client")
    await page.locator("[type='email']").fill("sahil.khenat.career@gmail.com")
    await page.locator("[type='password']").fill("Rahul@12345")
    await page.locator("[type='submit']").click()

    // Before Dashboard page redirection - disable images
    await page.route("**/*.{png, jpg, jpeg}", route => route.abort())

    await page.waitForURL("https://rahulshettyacademy.com/client/#/dashboard/dash")
    await page.locator("[routerlink='/dashboard/myorders']").first().click()

    console.log("Abort ")

})
