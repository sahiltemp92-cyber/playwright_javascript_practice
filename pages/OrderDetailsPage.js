class OrderDetailsPage {
    constructor(page) {
        this.page = page
        this.detail_order_id = page.locator(".-main")
    }
    async getOrderDetailId() {
        const detail_order_id = await this.detail_order_id.textContent()
        return detail_order_id
    }
}
module.exports = { OrderDetailsPage }