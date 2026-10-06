class LoginPage {
    constructor(page) {
        this.page = page
        this.email = page.locator("[id='userEmail']")
        this.password = page.locator("[id='userPassword']")
        this.login = page.locator("//input[@name='login']")
    }

    async goToLoginPage() {
        await this.page.goto("https://rahulshettyacademy.com/client/#/auth/login")
    }

    async validLogin(username, password) {
        await this.email.fill(username)
        await this.password.fill(password)
        await this.login.click()
        await this.page.waitForLoadState("domcontentloaded")
    }

    async InvalidLogin(username, password) {
        await this.email.fill(username)
        await this.password.fill(password)
        await this.login.click()
    }
}

module.exports = { LoginPage }