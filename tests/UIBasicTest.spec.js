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

test("UI controls", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    const document_link = page.locator("[href*='documents-request']")
    const userName_textbox = page.locator("#username")
    const userPassword_textbox = page.locator("//input[@name='password']")
    const user_radio_button = page.locator("//input[@type='radio'][@value='user']")
    const dropdown = page.locator("select.form-control")
    await dropdown.selectOption("consult")
    await page.pause()

    await page.locator(".radiotextsty").last().click() //last radio button (user) is clicked
    await page.locator("#okayBtn").click() //okay button is clicked

    //assertions
    console.log(await page.locator(".radiotextsty").last().isChecked())
    await expect(page.locator(".radiotextsty").last()).toBeChecked()
    await page.locator("#terms").click()
    expect(await page.locator("#terms").isChecked())
    await page.locator("#terms").uncheck()
    expect(await page.locator("#terms").isChecked()).toBeFalsy()
    await expect(document_link).toHaveAttribute("class", "blinkingText")
    const signIn_button = page.locator("#signInBtn")

    await userName_textbox.fill("rahulshettyacademy")
    await userPassword_textbox.fill("Learning@830$3mK2")
    await signIn_button.click()
})

test("Child Window Handling", async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    const document_link = page.locator("[href*='documents-request']")

    // Promise can be either pending, rejected, fulfilled
    const [child_page] = await Promise.all(
        [
            context.waitForEvent("page"), // Listen for any new page
            document_link.click() //new page found
        ]
    )

    const text = await child_page.locator(".red").textContent()
    const array_text = text.split("@")
    const domain_name = array_text[1].split(" ")[0]
    console.log(domain_name)
    await page.locator("#username").fill(domain_name)
    const username_input_value = await page.locator("#username").inputValue()
    expect(username_input_value).toEqual(domain_name)
    console.log(username_input_value)
}
)