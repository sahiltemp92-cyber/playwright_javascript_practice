import { expect, test as baseTest } from "@playwright/test";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface CreditCardInfo {
    creditCardNumber: string;
    month: string;
    day: string;
    cvv: string;
    nameOnCard: string;
    coupon: string;
}

export interface TestDataForOrder {
    login_credentials: LoginCredentials;
    productName: string;
    creditCardInfo: CreditCardInfo;
    country: string;
}

export const customtest = baseTest.extend<{ testDataForOrder: TestDataForOrder }>({
    testDataForOrder: {
        login_credentials: {
            email: "sahil.khenat.career@gmail.com",
            password: "Rahul@12345",
        },
        productName: "ADIDAS ORIGINAL",
        creditCardInfo: {
            creditCardNumber: "1234 5678 9101 1122",
            month: "12",
            day: "25",
            cvv: "123",
            nameOnCard: "Sahil Khenat",
            coupon: "rahulshettyacademy20",
        },
        country: "India",
    },
});

export { expect };
