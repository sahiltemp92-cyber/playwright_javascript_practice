class OrdersListPage {
    constructor(page) {
        this.page = page
        this.orders_table = page.locator(".table.ng-star-inserted")
        this.rows = page.locator("tbody tr")
        this.rows_count = this.rows.count()
        this.viewButton = page.locator("button.btn-primary")
        this.thankyou_message = page.locator("p.tagline")
        this.detail_order_id = page.locator(".-main")
    }

    async goToOrdersPage() {
        await this.page.waitForLoadState("domcontentloaded")
    }
    async verifyOrdersPage() {
        await this.orders_table.waitFor()
    }
    async verifyOrderDetails() {
        await this.thankyou_message.waitFor()
        console.log(await this.thankyou_message.textContent())
        expect(await this.thankyou_message.textContent()).toEqual("Thank you for Shopping With Us")
    }
    async verifyOrderDetailId(orderId) {
        const detail_order_id = await this.detail_order_id.textContent()
        expect(detail_order_id).toContain(orderId)
    }

}
module.exports = { OrdersListPage }