import { Page, Locator } from "@playwright/test";

export class CartPage {
    page: Page;
    cart_products: Locator;
    cart_product_name: Locator;
    checkout_button: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cart_products = page.locator("div li");
        this.cart_product_name = page.locator("h3");
        this.checkout_button = page.locator('button:has-text("Checkout")');
    }

    async getCartProducts(): Promise<string[]> {
        await this.cart_products.first().waitFor();
        const all_products = this.page.locator("h3");
        const all_products_names = await all_products.allTextContents();
        console.log(all_products_names);
        return all_products_names;
    }

    async clickCheckout(): Promise<void> {
        await this.checkout_button.click();
        await this.page.waitForLoadState("domcontentloaded");
    }
}
