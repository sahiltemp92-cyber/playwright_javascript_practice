import { Page, Locator } from "@playwright/test";

export class LoginPage {
    page: Page;
    email: Locator;
    password: Locator;
    login: Locator;

    constructor(page: Page) {
        this.page = page;
        this.email = page.locator("[id='userEmail']");
        this.password = page.locator("[id='userPassword']");
        this.login = page.locator("//input[@name='login']");
    }

    async goToLoginPage(): Promise<void> {
        await this.page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    }

    async validLogin(username: string, password: string): Promise<void> {
        await this.email.fill(username);
        await this.password.fill(password);
        await this.login.click();
        await this.page.waitForLoadState("domcontentloaded");
    }

    async InvalidLogin(username: string, password: string): Promise<void> {
        await this.email.fill(username);
        await this.password.fill(password);
        await this.login.click();
    }
}
