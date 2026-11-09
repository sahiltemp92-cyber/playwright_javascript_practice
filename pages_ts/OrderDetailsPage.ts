import { Page, Locator } from "@playwright/test";

export class OrderDetailsPage {
    page: Page;
    detail_order_id: Locator;

    constructor(page: Page) {
        this.page = page;
        this.detail_order_id = page.locator(".-main");
    }

    async getOrderDetailId(): Promise<string | null> {
        const detail_order_id = await this.detail_order_id.textContent();
        return detail_order_id;
    }
}
