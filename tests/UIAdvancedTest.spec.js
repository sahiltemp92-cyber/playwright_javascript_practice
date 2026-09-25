import { test, expect } from '@playwright/test';

test("Hide & Show TextBox Validations", async ({ page }) => {

    await page.goto('https://rahulshettyacademy.com/AutomationPractice/')
    await page.goto("https:www.google.com")
    await page.goBack()
    await page.goForward()
    await page.goBack()

    await page.locator("#hide-textbox").click()
    await expect(page.locator("#displayed-text")).toBeHidden()

    await page.locator("#show-textbox").click()
    await expect(page.locator("#displayed-text")).toBeVisible()
}
)

test("Alert popup handling", async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/')
    await page.getByPlaceholder("Enter Your Name").fill("Sahil")
    page.on("dialog", dialog => dialog.accept())
    await page.locator("#alertbtn").click()
    await page.locator("#confirmbtn").click()

})


test("Mouse hover handling", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/")
    await page.getByRole("button", { name: "Mouse Hover" }).hover()
    await page.getByRole('link', { name: 'Reload' }).click()
    await page.getByRole("button", { name: "Mouse Hover" }).hover()
    await page.getByRole("link", { name: "Top" }).click()
}
)

test.only("Frame handling", async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/')
    const framesPage = page.frameLocator("#courses-iframe")
    await framesPage.locator("a[href*='lifetime-access']:visible").first().click()
    const textCheck = await framesPage.locator(".text h2").textContent()

    console.log(textCheck)
    console.log(textCheck.split(" ")[1])
    await expect(textCheck.split(" ")[1]).toBe("13,522")
}

)