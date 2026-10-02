import { test, expect } from "@playwright/test"



test.only("Screenshot and Visual Regression", async ({ page }) => {
    // Screenshot at locator level
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/")
    await expect(page.locator("#displayed-text")).toBeVisible()
    await page.locator("#displayed-text").screenshot({ path: "screenshots/locatorLevelScreenshot.png" })

    // Screenshot at full page level
    await page.locator("#hide-textbox").click()
    await expect(page.locator("#displayed-text")).toBeHidden()
    await page.screenshot({ path: "screenshots/fullPageScreenshot.png" })

    // Screenshot comparison
    await page.goto("https://eventhub.rahulshettyacademy.com/login")
    expect(await page.screenshot()).toMatchSnapshot("screenshots/eventhubLoginPageScreenshot.png")
})