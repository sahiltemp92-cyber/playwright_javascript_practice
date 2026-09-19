import { test, expect } from '@playwright/test';

/*
Syntax of test
test('Test Name', async({parameter}) => {
    // Test Steps 
    // Assertions
})
*/

test('Browser Context - First Playwright Test', async ({ browser }) => {
    //Chrome Plugin and Cookies
    const context = await browser.newContext(); // context creation
    const page = await context.newPage(); // page creation
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/"); // navigates to the mentioned URL
    console.log(await page.title()); // prints the title of the page
})

test("Google Playwright Test", async ({ page }) => {
    await page.goto("https://www.google.com")
    console.log(page.title());
    await expect(page).toHaveTitle('Google')
}
)
