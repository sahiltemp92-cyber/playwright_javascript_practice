import { Page, Locator } from "@playwright/test";

export class DashboardPage {
    page: Page;
    products: Locator;
    productsText: Locator;
    cart: Locator;

    constructor(page: Page) {
        this.page = page;
        this.products = page.locator(".card-body");
        this.productsText = page.locator(".card-body b");
        this.cart = page.locator("[routerlink*='cart']");
    }

    // Search a product
    async addProductToCart(productName: string): Promise<void> {
        await this.productsText.first().waitFor();
        const titles = await this.productsText.allTextContents();
        console.log(titles);
        const count = await this.products.count();
        for (let i = 0; i < count; i++) {
            const iteration_product_name = await this.products.nth(i).locator("b").textContent();
            if (iteration_product_name === productName) {
                await this.products.nth(i).locator("text=Add To Cart").click();
                break;
            }
        }
    }

    // Navigate to cart
    async navigateToCart(): Promise<void> {
        await this.cart.click();
        await this.page.waitForLoadState("domcontentloaded");
    }
}
