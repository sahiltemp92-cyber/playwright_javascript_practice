import { Page, Locator } from "@playwright/test";

export class ThankYouPage {
    page: Page;
    thankyou_message: Locator;
    orderId_str: Locator;

    constructor(page: Page) {
        this.page = page;
        this.thankyou_message = page.locator("p.tagline");
        this.orderId_str = page.locator(".order-summary label[style*='color']");
    }

    async verifyThankYouPage(): Promise<void> {
        await this.thankyou_message.waitFor();
    }

    async getThankYouMessage(): Promise<string | null> {
        const thankyouMessage = await this.thankyou_message.textContent();
        return thankyouMessage;
    }

    async getOrderDetailId(): Promise<string | null> {
        const detail_order_id = await this.orderId_str.textContent();
        return detail_order_id;
    }
}
