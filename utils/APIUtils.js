export class APIUtils {

    constructor(apiContext, loginPayload) {
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }

    async getToken() {
        // Login API call
        const loginAPIResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
            data: this.loginPayload
        });
        const loginAPIResponseJSON = await loginAPIResponse.json();
        const token = loginAPIResponseJSON.token;
        return token;
    }

    async createOrder(orderPayload) {
        // Create Order API call
        let response = {};
        response.token = await this.getToken();
        const orderAPIResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", {
            data: orderPayload,
            headers: {
                'Authorization': response.token,
                'Content-Type': 'application/json'
            }
        });
        const orderAPIResponseJSON = await orderAPIResponse.json();
        const orderID = orderAPIResponseJSON.orders[0];
        console.log("Order ID:", orderID);
        response.orderID = orderID;
        return response;
    }
}