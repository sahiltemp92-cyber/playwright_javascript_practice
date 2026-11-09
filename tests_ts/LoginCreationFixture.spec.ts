/*
Assignment 5: Build a Two-Fixture Test — Login Fixture + Event Creation Fixture
*/
const { expect } = require('@playwright/test');
const { eventTest } = require('../utils/fixtures.js');

eventTest('newly created event should appear on the events page', async ({ eventAuthenticatedPage, createEvent }) => {
    console.log("createEvent object:", createEvent);
    await eventAuthenticatedPage.goto('https://eventhub.rahulshettyacademy.com/events');
    await expect(eventAuthenticatedPage.getByText(createEvent.title)).toBeVisible();
})