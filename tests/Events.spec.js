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
test.only("Create event via UI, book it and verify seat reduction", async ({ page }) => {
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

    await targetCard.getByTestId("book-now-btn").click()


}

)