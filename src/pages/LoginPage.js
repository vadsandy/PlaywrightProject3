class LoginPage {
    constructor(page) {
        this.page = page;
        // Selectors
        this.usernameInput = page.locator('#userName');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('#login');
        this.errorMessage = page.locator('#name');
    }

    async navigateTo() {
        await this.page.goto('https://demoqa.com/login');
    }

    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    
}

module.exports = { LoginPage };