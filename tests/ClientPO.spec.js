import { POManager } from '../pages/POManager.js'
import { test, expect } from '@playwright/test'

test.only("Client APP E2E", async ({ page }) => {
    // Test data 
    const login_credentials = {
        email: "sahil.khenat.career@gmail.com",
        password: 'Rahul@12345'
    }
    const productName = "ADIDAS ORIGINAL"
    const email_id = login_credentials.email
    const password = login_credentials.password
    const creditCardInfo = {
        creditCardNumber: "1234 5678 9101 1122",
        month: "12",
        day: "25",
        cvv: "123",
        nameOnCard: "Sahil Khenat",
        coupon: "rahulshettyacademy20"
    }
    const country_name = "India"
    // PageObject Manager
    const poManager = new POManager(page)

    // Login
    const loginPage = poManager.getLoginPage()
    await loginPage.goToLoginPage()
    await loginPage.validLogin(email_id, password)

    // Dashboard
    const dashboardPage = poManager.getDashboardPage()
    await dashboardPage.addProductToCart(productName)
    await dashboardPage.navigateToCart()

    // Go to cart
    const cartPage = poManager.getCartPage()
    const cartProducts = await cartPage.getCartProducts()
    console.log(cartProducts)
    expect(cartProducts).toContain(productName)

    // Checkout
    await cartPage.clickCheckout()

    const checkoutPage = poManager.getCheckoutPage()

    // Fill Credit Card info - Credit card number, CVV, Expiry date, Name on card
    await checkoutPage.fillCreditCardDetails(creditCardInfo.creditCardNumber, creditCardInfo.month, creditCardInfo.day, creditCardInfo.cvv, creditCardInfo.nameOnCard, creditCardInfo.coupon)

    // Fill Shipping Info - Email, Country
    await checkoutPage.fillShippingDetails(country_name)

    // Verify email is same as login email
    const prefilledEmail = await checkoutPage.getPrefilledEmail()
    expect(prefilledEmail).toEqual(email_id)

    // Place order
    await checkoutPage.placeOrder()
    const success_message = await checkoutPage.success_message.textContent()
    expect(success_message.trim()).toEqual("Thankyou for the order.")
    const orderId_str = await checkoutPage.orderId_str.textContent()
    const orderId = orderId_str.split(" ")[2]; //Split by space and get the third element
    console.log(orderId)

    // Go to Orders page
    await checkoutPage.goToOrdersPage()

    // View order details for respective orderID
    const ordersListPage = poManager.getOrdersListPage()
    await ordersListPage.orders_table.waitFor()

    const rows_count = await ordersListPage.rows.count()
    for (let i = 0; i < rows_count; i++) {
        // Click on View button that is on same row as 
        const rowOrderId = await ordersListPage.rows.nth(i).locator("th").textContent()
        if (orderId.includes(rowOrderId)) {
            await ordersListPage.rows.nth(i).locator("button").filter({ hasText: 'View' }).first().click()
            break;
        }
    }

    // Verify order details are as expected on Orders LIst Page 
    await page.waitForLoadState("domcontentloaded")

    const thankyouPage = poManager.getThankYouPage()
    await thankyouPage.thankyou_message.waitFor()
    console.log(await thankyouPage.thankyou_message.textContent())
    expect(await thankyouPage.thankyou_message.textContent()).toEqual("Thank you for Shopping With Us")

    // Verify order details are as expected on Order Details Page
    const orderDetailsPage = poManager.getOrderDetailsPage()
    const detail_order_id = await orderDetailsPage.getOrderDetailId()
    expect(detail_order_id).toContain(orderId)


})