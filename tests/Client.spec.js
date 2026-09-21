const { test, expect } = require('@playwright/test')

test('Extract text content - Test with Locators', async ({ page }) => {
    // const context = await browser.newContext();
    // const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    console.log(await page.title());
    await page.locator("[id='userEmail']").fill("sahil.khenat.career@gmail.com")
    await page.locator("[id='userPassword']").fill("Rahul@12345")
    await page.locator("//input[@name='login']").click();
    await page.waitForLoadState("domcontentloaded"); // Wait till the page is loaded completely
    const sign_out_button = page.getByRole("button", { name: "Sign Out" });

    await expect(sign_out_button).toBeVisible();


    // Get all products names and verify ADIDAS ORIGINAL is in it
    const all_products = page.locator(".card-body b");
    const all_products_names = (await all_products.allTextContents());
    console.log(all_products_names);
    expect(all_products_names).toContain("ADIDA1S ORIGINAL");

    // Get first product name and verify it contains ADIDAS ORIGINAL
    const first_product = page.locator(".card-body b").first();
    const first_product_name = (await first_product.textContent());
    expect(first_product_name).toContain('ADIDAS ORIGINAL');
    console.log(first_product_name);
}
)


test("Client APP E2E", async ({ page }) => {
    const productName = "ZARA COAT 3"
    const products = page.locator(".card-body")
    const email_id = "sahil.khenat.career@gmail.com"
    // Login
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page.locator("[id='userEmail']").fill(email_id)
    await page.locator("[id='userPassword']").fill("Rahul@12345")
    await page.locator("//input[@name='login']").click();
    await page.waitForLoadState("domcontentloaded");
    await page.locator(".card-body b").first().waitFor()

    // Titles of all products
    const titles = await page.locator('.card-body b').allTextContents();
    console.log(titles);

    // Count of all products
    const count = await products.count()
    console.log(count);

    // Iterate over the products and click on the one that contains product name eg: Zara 
    for (let i = 0; i < count; i++) {
        let iteration_product_name = await products.nth(i).locator("b").textContent()
        if (iteration_product_name === productName) {
            await products.nth(i).locator(".fa-shopping-cart").click() // Click on respective Add to Cart button
            break;
        }
    }

    // Go to cart
    await page.locator("[routerlink*='cart']").click()
    await page.locator("div li").first().waitFor()  // wait for cart entries are loaded
    const bool = await page.locator("h3").filter({ hasText: productName }).isVisible()
    console.log(bool)
    expect(bool).toBeTruthy()


    // Checkout
    await page.locator('button:has-text("Checkout")').click()

    // Fill Credit Card info - Credit card number, CVV, Expiry date, Name on card
    await page.locator("//div[normalize-space()='Credit Card Number']/following-sibling::input").fill("1234 5678 9101 1122");
    await page.locator("select.input.ddl").first().selectOption("12"); // select month
    await page.locator("select.input.ddl").last().selectOption("25"); // select day
    await page.locator("//div[text()='CVV Code ']/following-sibling::input").fill("123");
    await page.locator("//div[normalize-space()='Name on Card']/following-sibling::input").fill("Sahil Khenat");
    await page.locator("[name='coupon']").fill("rahulshettyacademy20");
    await page.getByRole('button', { name: 'Apply Coupon' }).click()

    // Fill Shipping Info - Email, Country
    await page.getByPlaceholder('Select Country').pressSequentially('Indi', { delay: 150 });
    const country_dropdown = page.locator(".ta-results") //wait for the options to load
    await country_dropdown.waitFor()
    const optionsCount = await country_dropdown.locator("button").count()
    for (let i = 0; i < optionsCount; i++) {
        let text = await country_dropdown.locator("button").nth(i).textContent()
        if (text.trim() === "India") {
            await country_dropdown.locator("button").nth(i).click()
            break;
        }
    }

    // Verify email is same as login email
    const mail = await page.locator(".user__name label").textContent()
    console.log(mail)
    expect(mail).toEqual(email_id)

    // Place order
    await page.locator("a.action__submit").click()
    const success_message = await page.locator(".hero-primary").textContent()
    expect(success_message.trim()).toEqual("Thankyou for the order.")
    const orderId_str = await page.locator(".em-spacer-1 .ng-star-inserted").textContent()
    const orderId = orderId_str.split(" ")[2]; //Split by space and get the third element
    console.log(orderId)

    // Go to Orders page
    await page.locator("[routerlink*='myorders']").first().click()
    const orders_table = page.locator(".table.ng-star-inserted")
    await orders_table.waitFor()

    // View order details for respective orderID
    const rows = page.locator("tbody tr")
    const rows_count = await rows.count()
    for (let i = 0; i < rows_count; i++) {
        // Click on View button that is on same row as 
        const rowOrderId = await rows.nth(i).locator("th").textContent()
        if (orderId.includes(rowOrderId)) {
            await page.locator("tbody tr").locator("button.btn-primary").nth(i).click()
            break;
        }
    }
    // Verify order details are as expected on Orders LIst Page 
    await page.waitForLoadState("domcontentloaded")
    const thankyou_message = page.locator("p.tagline")
    await thankyou_message.waitFor()
    console.log(await thankyou_message.textContent())
    expect(await thankyou_message.textContent()).toEqual("Thank you for Shopping With Us")

    // Verify order details are as expected on Order Details Page
    const detail_order_id = await page.locator(".-main").textContent()
    expect(detail_order_id).toContain(orderId)


})