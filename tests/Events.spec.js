import { test, expect } from "@playwright/test"

// Credentials
const EMAIL_ADDRESS = "sahil.khenat.career@gmail.com"
const PASSWORD = "Rahul@12345"

// Base URL
const BASE_URL = "https://eventhub.rahulshettyacademy.com"

// Helper Login method
async function login(page) {
    page.goto(`${BASE_URL}/login`);
    await page.getByPlaceholder("you@email.com").fill(EMAIL_ADDRESS)
    await page.getByLabel("Password").fill(PASSWORD)
    await page.locator("#login-btn").click()
    await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible()
}

// Helper to generate future datetime in DD-MM-YYYY HH:MM format
/**
 * Generates a future date time string in "DD-MM-YYYY HH:MM" format
 * @param {number} daysAhead - Number of days in the future (default: 1)
 * @returns {string} Formatted date string: DD-MM-YYYY HH:MM
 */
function getFutureDateTime(daysAhead = 1) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const day = String(futureDate.getDate()).padStart(2, '0');
    const month = String(futureDate.getMonth() + 1).padStart(2, '0');
    const year = futureDate.getFullYear();
    const hours = String(futureDate.getHours()).padStart(2, '0');
    const minutes = String(futureDate.getMinutes()).padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}`;
}

/**
 * Enters a "DD-MM-YYYY HH:MM" date string into a <input type="datetime-local"> field
 * @param {import('@playwright/test').Locator} locator - Playwright Locator for the datetime input
 * @param {string} dateTimeStr - Date string in "DD-MM-YYYY HH:MM" format
 */
async function enterDateTime(locator, dateTimeStr) {
    // Convert DD-MM-YYYY HH:MM to HTML5 standard YYYY-MM-DDTHH:mm for .fill()
    const [datePart, timePart] = dateTimeStr.split(' ');
    const [day, month, year] = datePart.split('-');
    const isoDateTime = `${year}-${month}-${day}T${timePart}`;

    await locator.fill(isoDateTime);
}


// Test
test("Create event via UI, book it and verify seat reduction", async ({ page }) => {
    // Step 1 : Login
    await login(page)

    // Step 2 : Create a new event via the admin form
    await page.goto(`${BASE_URL}/admin/events`)
    let eventTitle = `Test Event ${Date.now()}`
    let eventDescription = `Test Event Description ${Date.now()}`
    let eventCity = 'Pune'
    let eventVenue = "Nanded City Amphitheatre"
    let eventPrice = "100"
    let eventTotalSeats = "50"

    await page.locator("#event-title-input").fill(eventTitle)
    await page.locator("#admin-event-form textarea").fill(eventDescription)
    await page.getByLabel("City").fill(eventCity)
    await page.getByLabel("Venue").fill(eventVenue)

    // Generate date in DD-MM-YYYY HH:MM format and enter it
    const futureDateStr = getFutureDateTime(1); // Next day
    const dateInput = page.locator('[id="event-date-&-time"]');
    await enterDateTime(dateInput, futureDateStr);
    await page.getByLabel("Price ($)").fill(eventPrice)
    await page.getByLabel("Total Seats").fill(eventTotalSeats)
    await page.locator("#add-event-btn").click()
    await expect(page.getByText('Event created!')).toBeVisible()

    // Step 3 : Find the event card and capture seats
    await page.goto(`${BASE_URL}/events`)
    const allEventCards = page.locator("[data-testid='event-card']")
    await expect(allEventCards.first()).toBeVisible()

    const targetCard = allEventCards.filter({ hasText: eventTitle }).first()
    await expect(targetCard).toBeVisible({ timeout: 5000 })

    const seatsBeforeBooking = parseInt(await targetCard.getByText('seat').first().innerText())
    console.log(`Seats before booking : ${seatsBeforeBooking}`)

    // Step 4 : Start booking
    await targetCard.getByTestId("book-now-btn").click()

    // Step 5 : Fill the booking form
    let fullName = "Sahil Khenat"
    let eventEmail = "sahil@example.com"
    let eventPhone = "+91 9876543210"
    await expect(page.locator("#ticket-count")).toHaveText("1")
    await page.getByLabel("Full Name").fill(fullName)
    await page.locator("#customer-email").fill(eventEmail)
    await page.getByPlaceholder("+91 98765 43210").fill(eventPhone)
    await page.locator(".confirm-booking-btn").click()

    // Step 6 : Verify booking confirmation
    const bookingRef = page.locator(".booking-ref").first()
    await expect(bookingRef).toBeVisible()
    let bookingRefNumber = await bookingRef.innerText()
    console.log(`Booking Reference Number : ${bookingRefNumber}`)

    // Step 7 : Verify booking appears in My Bookings
    await page.getByRole('button', { name: 'View My Bookings' }).click()
    await page.waitForURL(`${BASE_URL}/bookings`)
    expect(page.url()).toBe(`${BASE_URL}/bookings`)
    const allBookingCards = await page.locator("#booking-card")
    await expect(allBookingCards.first()).toBeVisible()
    const matchingCard = allBookingCards.filter({ has: page.locator(".booking-ref", { hasText: bookingRefNumber }) })
    await expect(matchingCard).toBeVisible({ timeout: 5000 })
    await expect(matchingCard).toContainText(eventTitle)

    // Step 8 : Verify Seat reduction
    await page.goto(`${BASE_URL}/events`)
    await expect(allEventCards.first()).toBeVisible()

    const targetCardAfterBooking = allEventCards.filter({ hasText: eventTitle }).first()
    await expect(targetCardAfterBooking).toBeVisible({ timeout: 5000 })

    const seatsAfterBooking = parseInt(await targetCardAfterBooking.getByText('seat').first().innerText())
    console.log(`Seats after booking : ${seatsAfterBooking}`)

    expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1)


}

)


async function loginAndGoToBookings(page) {
    await login(page)
    await page.getByRole("button", { name: "My Bookings" }).click()
    await page.waitForURL(`${BASE_URL}/bookings`)
    expect(page.url()).toBe(`${BASE_URL}/bookings`)
}

test("Refund eligibility check - Eligible scenario", async ({ page }) => {

    // Step 1 - Login
    await login(page)

    // Step 2 - Book first event with 1 ticket
    await page.goto(`${BASE_URL}/events`)
    const allEventCards = page.locator("[data-testid='event-card']")
    await expect(allEventCards.first()).toBeVisible()

    const targetCard = allEventCards.first()
    await expect(targetCard).toBeVisible({ timeout: 5000 })

    await targetCard.getByTestId("book-now-btn").click()

    let fullName = "Sahil Khenat"
    let eventEmail = "sahil@example.com"
    let eventPhone = "+91 9876543210"
    await expect(page.locator("#ticket-count")).toHaveText("1")
    await page.getByLabel("Full Name").fill(fullName)
    await page.locator("#customer-email").fill(eventEmail)
    await page.getByPlaceholder("+91 98765 43210").fill(eventPhone)
    await page.locator(".confirm-booking-btn").click()

    // Step 3 - Navigate to booking details
    await page.getByRole('button', { name: 'View My Bookings' }).click()
    await page.waitForURL(`${BASE_URL}/bookings`)
    await page.getByRole("button", { name: "View Details" }).first().click()
    await page.waitForURL(RegExp(`${BASE_URL}/bookings` + `/.+`))
    expect(page.getByRole('heading', { name: 'Booking Information' })).toBeVisible()

    // Step 4 - Validate booking ref
    let bookingRef = await page.locator("span.font-mono.font-bold").first().innerText()
    let eventTitle = await page.locator("h1").innerText()
    expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0))

    // Step 5 - Verify refund eligibility
    await page.getByTestId("check-refund-btn").click()
    await expect(page.getByTestId("refund-spinner")).toBeVisible()
    await expect(page.getByTestId("refund-spinner")).not.toBeVisible({ timeout: 60000 })

    // Step 6 - Validate result
    let refundResult = await page.locator("#refund-result").innerText()
    expect(refundResult).toContain("Eligible for refund.")
    expect(refundResult).toContain("Single-ticket bookings qualify for a full refund.")
}
)


test.only("Refund eligibility check - Not eligible for group ticket scenario", async ({ page }) => {

    // Step 1 - Login
    await login(page)

    // Step 2 - Book first event with 3 ticket
    await page.goto(`${BASE_URL}/events`)
    const allEventCards = page.locator("[data-testid='event-card']")
    await expect(allEventCards.first()).toBeVisible()

    const targetCard = allEventCards.first()
    await expect(targetCard).toBeVisible({ timeout: 5000 })

    await targetCard.getByTestId("book-now-btn").click()

    let fullName = "Sahil Khenat"
    let eventEmail = "sahil@example.com"
    let eventPhone = "+91 9876543210"

    await expect(page.locator("#ticket-count")).toHaveText("1")
    await page.getByRole('button', { name: '+' }).click()   // click + first time
    await page.getByRole('button', { name: '+' }).click()    // click + second time
    await expect(page.locator("#ticket-count")).toHaveText("3")
    await page.getByLabel("Full Name").fill(fullName)
    await page.locator("#customer-email").fill(eventEmail)
    await page.getByPlaceholder("+91 98765 43210").fill(eventPhone)
    await page.locator(".confirm-booking-btn").click()

    // Step 3 - Navigate to booking details
    await page.getByRole('button', { name: 'View My Bookings' }).click()
    await page.waitForURL(`${BASE_URL}/bookings`)
    await page.getByRole("button", { name: "View Details" }).first().click()
    await page.waitForURL(RegExp(`${BASE_URL}/bookings` + `/.+`))
    expect(page.getByRole('heading', { name: 'Booking Information' })).toBeVisible()

    // Step 4 - Validate booking ref
    let bookingRef = await page.locator("span.font-mono.font-bold").first().innerText()
    let eventTitle = await page.locator("h1").innerText()
    expect(bookingRef.charAt(0)).toBe(eventTitle.charAt(0))

    // Step 5 - Verify refund eligibility
    await page.getByTestId("check-refund-btn").click()
    await expect(page.getByTestId("refund-spinner")).toBeVisible()
    await expect(page.getByTestId("refund-spinner")).not.toBeVisible({ timeout: 60000 })

    // Step 6 - Validate result
    let refundResult = await page.locator("#refund-result").innerText()
    expect(refundResult).toContain("Not eligible for refund.")
    expect(refundResult).toContain("Group bookings (3 tickets) are non-refundable.")
}
)