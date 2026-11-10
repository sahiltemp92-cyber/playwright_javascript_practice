import { APIRequestContext } from "@playwright/test";

export interface LoginPayload {
    userEmail: string;
    userPassword: string;
}

export interface OrderItem {
    country: string;
    productOrderedId: string;
}

export interface OrderPayload {
    orders: OrderItem[];
}

export interface OrderResponse {
    token?: string;
    orderID?: string;
    [key: string]: any;
}

export class APIUtils {
    apiContext: APIRequestContext;
    loginPayload: LoginPayload | Record<string, any>;

    constructor(apiContext: APIRequestContext, loginPayload: LoginPayload | Record<string, any>) {
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }

    async getToken(): Promise<string> {
        // Login API call
        const loginAPIResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
            data: this.loginPayload,
        });
        const loginAPIResponseJSON = await loginAPIResponse.json();
        const token: string = loginAPIResponseJSON.token;
        return token;
    }

    async createOrder(orderPayload: OrderPayload | Record<string, any>): Promise<OrderResponse> {
        // Create Order API call
        const response: OrderResponse = {};
        response.token = await this.getToken();
        const orderAPIResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
            data: orderPayload,
            headers: {
                Authorization: response.token,
                "Content-Type": "application/json",
            },
        });
        const orderAPIResponseJSON = await orderAPIResponse.json();
        const orderID: string = orderAPIResponseJSON.orders[0];
        console.log("Order ID:", orderID);
        response.orderID = orderID;
        return response;
    }
}
