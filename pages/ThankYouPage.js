class ThankYouPage {
    constructor(page) {
        this.page = page
        this.thankyou_message = page.locator("p.tagline")
        this.orderId_str = page.locator(".order-summary label[style*='color']")
    }

    async verifyThankYouPage() {
        await this.thankyou_message.waitFor()
    }
    async getThankYouMessage() {
        const thankyouMessage = await this.thankyou_message.textContent()
        return thankyouMessage
    }
    async getOrderDetailId() {
        const detail_order_id = await this.orderId_str.textContent()
        return detail_order_id
    }
}
module.exports = { ThankYouPage }