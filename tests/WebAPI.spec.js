import { test, expect, request } from "@playwright/test";
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


let token;
let orderID;

test.beforeAll(async () => {
    const apiContext = await request.newContext()

    // Login API call
    const loginAPIResponse = await apiContext.post(URL,
        {
            data: loginPayload
        }
    )
    expect(loginAPIResponse.ok()).toBe(true)
    const loginAPIResponseJSON = await loginAPIResponse.json()
    token = loginAPIResponseJSON.token
    console.log(token)

    // Create Order API call
    const orderAPIResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
        {
            data: orderPayload,
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
        }
    )
    const orderAPIResponseJSON = await orderAPIResponse.json()
    orderID = orderAPIResponseJSON.orders[0]
    console.log(orderID)

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

test.only("Create Order", async ({ page }) => {
    // Script to add token in localstorage before page load
    page.addInitScript(async (value) => {
        window.localStorage.setItem("token", value);
    }, token)

    await page.goto("https://rahulshettyacademy.com/client/")
    await page.locator("[routerlink='/dashboard/myorders']").first().click()
    await page.locator("tbody").waitFor()

    const rows = page.locator("tbody tr")

    for (let i = 0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator("th").textContent()
        if (orderID.includes(rowOrderId)) {
            await rows.nth(i).locator("button").first().click()
            break;
        }
    }
    const orderIdDetails = await page.locator(".col-text").textContent()
    console.log(orderIdDetails)
    expect(orderIdDetails.includes(orderID)).toBe(true)
}
)