import { expect } from "@playwright/test"
import { customtest } from "../utils/fixtures.js"


customtest("Demonstrate Custom Fixtures", async ({ authenticatedPage, createOrder, testDataForOrder }) => {
    await authenticatedPage.goto("https://rahulshettyacademy.com/client/")
    await authenticatedPage.locator("button[routerlink*='myorders']").click()
    await authenticatedPage.locator("tbody").waitFor()
    await expect(authenticatedPage.getByText(createOrder.orderID).first()).toBeVisible()
    console.log(testDataForOrder.productName)
})

