import { LoginPage } from "./LoginPage";
import { DashboardPage } from "./DashboardPage";
import { CartPage } from "./CartPage";
import { CheckOutPage } from "./CheckOutPage";
import { OrdersListPage } from "./OrdersListPage";
import { ThankYouPage } from "./ThankYouPage";
import { OrderDetailsPage } from "./OrderDetailsPage";
import { Page } from "@playwright/test";

export class POManager {
    page: Page;
    loginPage?: LoginPage;
    dashboardPage?: DashboardPage;
    cartPage?: CartPage;
    checkoutPage?: CheckOutPage;
    ordersListPage?: OrdersListPage;
    thankYouPage?: ThankYouPage;
    orderDetailsPage?: OrderDetailsPage;

    constructor(page: Page) {
        this.page = page;
    }

    getLoginPage(): LoginPage {
        if (!this.loginPage) {
            this.loginPage = new LoginPage(this.page);
        }
        return this.loginPage;
    }

    getDashboardPage(): DashboardPage {
        if (!this.dashboardPage) {
            this.dashboardPage = new DashboardPage(this.page);
        }
        return this.dashboardPage;
    }

    getCartPage(): CartPage {
        if (!this.cartPage) {
            this.cartPage = new CartPage(this.page);
        }
        return this.cartPage;
    }

    getCheckoutPage(): CheckOutPage {
        if (!this.checkoutPage) {
            this.checkoutPage = new CheckOutPage(this.page);
        }
        return this.checkoutPage;
    }

    getOrdersListPage(): OrdersListPage {
        if (!this.ordersListPage) {
            this.ordersListPage = new OrdersListPage(this.page);
        }
        return this.ordersListPage;
    }

    getThankYouPage(): ThankYouPage {
        if (!this.thankYouPage) {
            this.thankYouPage = new ThankYouPage(this.page);
        }
        return this.thankYouPage;
    }

    getOrderDetailsPage(): OrderDetailsPage {
        if (!this.orderDetailsPage) {
            this.orderDetailsPage = new OrderDetailsPage(this.page);
        }
        return this.orderDetailsPage;
    }
}

