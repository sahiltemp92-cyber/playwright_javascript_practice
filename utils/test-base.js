import { expect, test } from "@playwright/test";

export const customtest = test.extend(
    {
        testDataForOrder: {
            login_credentials: {
                email: "sahil.khenat.career@gmail.com",
                password: "Rahul@12345"
            },
            productName: "ADIDAS ORIGINAL",
            creditCardInfo: {
                creditCardNumber: "1234 5678 9101 1122",
                month: "12",
                day: "25",
                cvv: "123",
                nameOnCard: "Sahil Khenat",
                coupon: "rahulshettyacademy20"
            },
            country: "India"
        }
    }
)
