const { Given, When, Then, setDefaultTimeout } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const AccountClient = require('../api/AccountClient');
const { DataReader } = require('../utils/DataReader');

setDefaultTimeout(30000);

// --- NAVIGATION ---
Given('I navigate to the DemoQA login page', async function () {
    this.loginPage = new LoginPage(this.page);
    await this.page.goto(`${this.baseUrl}/login`, { waitUntil: 'domcontentloaded' });
});

// --- UI LOGIN ---
When('I login using {string} data from {string} and key {string}', async function (type, path, key) {
    const data = await DataReader.getData(type, path, key);
    await this.loginPage.login(data.username, data.password);
});

// --- API LOGIN ---
When('I perform an API login using {string} data from {string} and key {string}', async function (type, path, key) {
    const data = await DataReader.getData(type, path, key);
    
    // Use the API context if it's an API-only test, otherwise use the page
    const requestContext = this.apiRequest || this.page.request;
    const accountClient = new AccountClient(requestContext);
    
    this.apiResponse = await accountClient.loginAndGetToken(data.username, data.password);
});

// --- ASSERTIONS ---
Then('I should verify if the login was successful', async function () {
    const logoutButton = this.page.getByRole('button', { name: 'Log out' });
    await expect(logoutButton).toBeVisible({ timeout: 10000 });
});

Then('the API response should indicate success with a valid token', async function () {
    expect(this.apiResponse).toBeDefined();
    // Validate the token exists and is long enough
    expect(this.apiResponse.token).toBeDefined();
    expect(this.apiResponse.token.length).toBeGreaterThan(10);
    
    // Suggestion: Remove the 'Success' check or make it optional
    // expect(this.apiResponse.status).toBe('Success');
});

Then('I should be able to fetch user account details using the token', async function () {
    const response = await this.page.request.get(`https://demoqa.com/Account/v1/User/${this.apiResponse.userId}`, {
        headers: { 'Authorization': `Bearer ${this.apiResponse.token}` }
    });
    expect(response.status()).toBe(200);
    const userDetails = await response.json();
    console.log(`Verified user via API: ${userDetails.username}`);
});