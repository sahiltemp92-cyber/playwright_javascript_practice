const { test, expect } = require('@playwright/test')

test.only('Extract text content - Login Test with Locators', async ({ page }) => {
    // const context = await browser.newContext();
    // const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    console.log(await page.title());
    await page.locator("[id='userEmail']").fill("sahil.khenat.career@gmail.com")
    await page.locator("[id='userPassword']").fill("Rahul@12345")
    await page.locator("//input[@name='login']").click();
    const sign_out_button = page.getByRole("button", { name: "Sign Out" });
    await expect(sign_out_button).toBeVisible();

    // Get first product name and verify it contains ADIDAS ORIGINAL
    const first_product = page.locator(".card-body b").first();
    const first_product_name = (await first_product.textContent());
    await expect(first_product_name).toContain('ADIDAS ORIGINAL')
    console.log(first_product_name);

    // Get all products names
    const all_products = page.locator(".card-body b");
    const all_products_names = (await all_products.allTextContents());
    console.log(all_products_names);
}
)