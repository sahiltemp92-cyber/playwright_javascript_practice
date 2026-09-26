import { test, expect, browser } from "@playwright/test"
let webContext;


test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto("https://rahulshettyacademy.com/client/")
    await page.locator("#userEmail").fill("sahil.khenat.career@gmail.com")
    await page.locator("#userPassword").fill("Rahul@12345")
    await page.locator("#login").click();
    await page.waitForLoadState("networkidle");
    await context.storageState({ path: "state.json" })
    webContext = await browser.newContext({ storageState: "state.json" })
}
)

test("Go to Dashboard page and print the product names", async () => {
    const page = await webContext.newPage()
    await page.goto("https://rahulshettyacademy.com/client/")
    await page.waitForLoadState("domcontentloaded")
    const products = await page.locator(".card-body")
    const titles = await page.locator(".card-body b")
    console.log(await titles.allTextContents());
}
)

test("Go to Dashboard Page and print all the categories", async () => {
    const page = await webContext.newPage()
    await page.goto("https://rahulshettyacademy.com/client/")
    const categories = await page.locator("[for='cat']").allTextContents()
    console.log("All the categories :" + categories)
})

test("Go to Orders list and print all order IDs", async () => {
    const page = await webContext.newPage()
    await page.goto("https://rahulshettyacademy.com/client/#/dashboard/myorders")
    await page.waitForLoadState("domcontentloaded")
    const orderIds = await page.locator("tbody tr th").allTextContents()
    console.log(orderIds)
})
