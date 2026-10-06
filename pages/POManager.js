import { LoginPage } from "./LoginPage"
import { DashboardPage } from "./DashboardPage"
import { CartPage } from "./CartPage"
import { CheckOutPage } from "./CheckoutPage"
import { OrdersListPage } from "./OrdersListPage"
import { ThankYouPage } from "./ThankYouPage"
import { OrderDetailsPage } from "./OrderDetailsPage"

class POManager {
    constructor(page) {
        this.page = page
    }

    getLoginPage() {
        if (!this.loginPage) {
            this.loginPage = new LoginPage(this.page)
        }
        return this.loginPage
    }

    getDashboardPage() {
        if (!this.dashboardPage) {
            this.dashboardPage = new DashboardPage(this.page)
        }
        return this.dashboardPage
    }

    getCartPage() {
        if (!this.cartPage) {
            this.cartPage = new CartPage(this.page)
        }
        return this.cartPage
    }

    getCheckoutPage() {
        if (!this.checkoutPage) {
            this.checkoutPage = new CheckOutPage(this.page)
        }
        return this.checkoutPage
    }

    getOrdersListPage() {
        if (!this.ordersListPage) {
            this.ordersListPage = new OrdersListPage(this.page)
        }
        return this.ordersListPage
    }

    getThankYouPage() {
        if (!this.thankYouPage) {
            this.thankYouPage = new ThankYouPage(this.page)
        }
        return this.thankYouPage
    }

    getOrderDetailsPage() {
        if (!this.orderDetailsPage) {
            this.orderDetailsPage = new OrderDetailsPage(this.page)
        }
        return this.orderDetailsPage
    }
}

module.exports = { POManager }
