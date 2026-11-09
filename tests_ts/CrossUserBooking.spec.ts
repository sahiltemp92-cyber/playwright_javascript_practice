import { test, expect } from "@playwright/test"

/*
Assignment 4: Create Cross-User Booking Test to Ensure Security - Verify Cross-User Booking Access Denied.

Steps:
1. Login as Yahoo User and get token
2. Get events via API to get a valid event ID for Yahoo user
3. Create a booking via API as Yahoo User
4. Login as Gmail User
5. Navigate to Yahoo user booking URL as Gmail User
6. Validate thaat access is denied for gmail user to yahoo user's bookings
*/
const BASE_URL = "https://eventhub.rahulshettyacademy.com"
const API_URL = "https://api.eventhub.rahulshettyacademy.com/api"

const YAHOO_USER = { userEmail: `sahil@yahoo.com`, userPassword: "Rahul@12345" }
const GMAIL_USER = { userEmail: `sahil@gmail.com`, userPassword: "Rahul@12345" }

async function loginAs(page, user) {
    await page.goto(`${BASE_URL}/login`)
    await page.getByPlaceholder("you@email.com").fill(user.userEmail)
    await page.getByLabel("Password").fill(user.userPassword)
    await page.locator("#login-btn").click()
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible()
}

test("Gmail User access is denied when viewing Yahoo user's booking", async ({ page, request }) => {

    //Step 1: Login as Yahoo User and get token
    const loginResponse = await request.post(`${API_URL}/auth/login`,
        {
            data:
            {
                email: YAHOO_USER.userEmail,
                password: YAHOO_USER.userPassword
            }
        })
    console.log("Status:", loginResponse.status())
    expect(loginResponse.ok()).toBeTruthy()
    const loginResponseJson = await loginResponse.json()
    console.log(loginResponse)
    const token = loginResponseJson.token
    console.log("Token:", token)

    // Step 2: Get events via API to get a valid event ID for Yahoo user
    const eventsListResponse = await request.get(`${API_URL}/events`,
        {
            headers:
            {
                "Authorization": `Bearer ${token}`
            }
        })
    console.log("Events Status:", eventsListResponse.status())
    expect(eventsListResponse.ok()).toBeTruthy()
    const eventsListResponseJson = await eventsListResponse.json()
    console.log("Events:", eventsListResponseJson)
    const { id: eventId } = eventsListResponseJson.data[0]
    console.log("Event ID:", eventId)

    // Step 3 : Create a booking via API as Yahoo User
    const createBookingResponse = await request.post(`${API_URL}/bookings`,
        {
            headers:
            {
                Authorization: `Bearer ${token}`
            },
            data: {
                "eventId": eventId,
                "customerName": "Sahil Yahoo",
                "customerEmail": "sahil@yahoo.com",
                "customerPhone": "+91-9876543210",
                "quantity": 1
            }
        }
    )
    console.log("Booking Response:", createBookingResponse.json())
    console.log("Booking Status:", createBookingResponse.status())
    expect(createBookingResponse.ok()).toBeTruthy()
    const createBookingResponseJson = await createBookingResponse.json()
    console.log("Booking:", createBookingResponseJson)
    const { id: yahooBookingID } = createBookingResponseJson.data
    console.log("Yahoo Booking ID:", yahooBookingID)

    //Step 4: Login as Gmail User
    await loginAs(page, GMAIL_USER)

    // Step 5 : Navigate to Yahoo user booking URL as Gmail User
    await page.goto(`${BASE_URL}/bookings/${yahooBookingID}`)

    // Step 6 : Validate thaat access is denied for gmail user to yahoo user's bookings
    await page.waitForLoadState('domcontentloaded')
    await expect(page.getByText('Access Denied', { exact: true })).toBeVisible()
    await expect(page.getByText('You are not authorized to view this booking.')).toBeVisible()

})
