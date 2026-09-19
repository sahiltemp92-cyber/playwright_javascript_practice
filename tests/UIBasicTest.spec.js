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

test.only('Extract text content - Login Test with Locators', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    console.log(await page.title());
    await page.locator("[id='userEmail']").fill("sahil.khenat.career@gmail.com")
    await page.locator("[id='userPassword']").fill("Rahul@12345")
    await page.locator("//input[@name='login']").click();
    const sign_out_button = page.getByRole("button", { name: "Sign Out" });
    await expect(sign_out_button).toBeVisible();
    console.log(await page.title());

    // Get first product name and verify it contains ADIDAS ORIGINAL
    const first_product = page.locator(".card-body").first();
    const first_product_body = (await first_product.textContent());
    console.log(first_product_body);
    await expect(first_product_body).toContain('ADIDAS ORIGINAL')

}
)