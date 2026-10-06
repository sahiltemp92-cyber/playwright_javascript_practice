class CheckOutPage {
    constructor(page) {
        this.page = page
        this.creditCardDetails = page.locator("//div[normalize-space()='Credit Card Number']/following-sibling::input")
        this.month = page.locator("select.input.ddl").first()
        this.day = page.locator("select.input.ddl").last()
        this.cvv = page.locator("//div[text()='CVV Code ']/following-sibling::input")
        this.nameOnCard = page.locator("//div[normalize-space()='Name on Card']/following-sibling::input")
        this.coupon = page.locator("[name='coupon']")
        this.applyCoupon = page.getByRole('button', { name: 'Apply Coupon' })
        this.shippingCountry = page.locator("[placeholder='Select Country']")
        this.countryDropdown = page.locator(".ta-results")
        this.countryOptions = this.countryDropdown.locator("button")
        this.email_prefilled_textbox = page.locator(".user__name label")
        this.placeOrderButton = page.locator("a.action__submit")
        this.success_message = page.locator(".hero-primary")
        this.orderId_str = page.locator(".em-spacer-1 .ng-star-inserted")
        this.goToOrdersButton = page.locator("[routerlink*='myorders']").first()

    }

    async fillCreditCardDetails(number, month, day, cvv, nameOnCard, coupon) {
        await this.creditCardDetails.fill(number);
        await this.month.selectOption(month); // select month
        await this.day.selectOption(day); // select day
        await this.cvv.fill(cvv);
        await this.nameOnCard.fill(nameOnCard);
        await this.coupon.fill(coupon);
        await this.applyCoupon.click()

    }

    async fillShippingDetails(country_name) {
        await this.shippingCountry.click()
        await this.shippingCountry.pressSequentially(country_name, { delay: 250 });
        await this.countryDropdown.waitFor()
        const optionsCount = await this.countryOptions.count()
        for (let i = 0; i < optionsCount; i++) {
            let text = await this.countryOptions.nth(i).textContent()
            if (text.trim() === country_name) {
                await this.countryOptions.nth(i).click()
                break;
            }
        }
    }

    async getPrefilledEmail() {
        await this.email_prefilled_textbox.waitFor();
        return await this.email_prefilled_textbox.textContent();
    }

    async placeOrder() {
        await this.placeOrderButton.click()
        await this.page.waitForLoadState("domcontentloaded")
    }

    async goToOrdersPage() {
        await this.goToOrdersButton.click()
        await this.page.waitForLoadState("domcontentloaded")
    }
}
module.exports = { CheckOutPage }