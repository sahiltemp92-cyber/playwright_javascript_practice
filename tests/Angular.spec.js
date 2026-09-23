import { test, expect } from '@playwright/test'

test("Playwright Special Locators", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/angularpractice/")

    // Label
    await page.getByLabel('Check me out if you Love IceCreams!').check()
    await page.getByLabel("Employed").check()
    await page.getByLabel("Gender").selectOption("Female")

    // Placeholder
    await page.getByPlaceholder("Password").fill("abcdef123456")

    // Xpath
    await page.locator("input[type='submit']").click()

    // Text
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible()

    // Link
    await page.getByRole("link", { name: "Shop" }).click()

    await page.locator("app-card").filter({ hasText: "Nokia Edge" }).getByRole("button").click()

}
)