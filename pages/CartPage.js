class CartPage {
    constructor(page) {
        this.page = page
        this.cart_products = page.locator("div li")
        this.cart_product_name = page.locator("h3")
        this.checkout_button = page.locator('button:has-text("Checkout")')
    }

    async getCartProducts() {
        await this.cart_products.first().waitFor()
        const all_products = this.page.locator("h3")
        const all_products_names = (await all_products.allTextContents());
        console.log(all_products_names);
        return all_products_names;
    }

    async clickCheckout() {
        await this.checkout_button.click()
        await this.page.waitForLoadState("domcontentloaded")
    }

}

module.exports = { CartPage }