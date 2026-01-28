const { Before, After, BeforeAll, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, request } = require('@playwright/test'); // Added 'request' here
const fs = require('fs');

// Global timeout for the entire step
setDefaultTimeout(60000); 

let browser;

BeforeAll(async function () {
    browser = await chromium.launch({ 
        headless: false,
        args: ['--start-maximized'] 
    });
});

Before(async function (scenario) {
    // Correctly extract tag names
    const tags = scenario.pickle.tags.map(t => t.name);
    
    if (tags.includes('@API')) {
        // Setup API context for API tests
        this.apiRequest = await request.newContext({
            baseURL: 'https://demoqa.com'
        });
    } else {
        // Setup Browser context for UI tests
        this.context = await browser.newContext({ viewport: null });
        this.page = await this.context.newPage();
        this.page.setDefaultTimeout(45000);
    }
});

After(async function (scenario) {
    // Only try to take a screenshot if a browser page exists (UI tests)
    if (scenario.result?.status === 'FAILED' && this.page) {
        const screenshot = await this.page.screenshot({ fullPage: true });
        this.attach(screenshot, 'image/png');
    }

    // Cleanup Page
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    // Cleanup API context
    if (this.apiRequest) await this.apiRequest.dispose();
});

AfterAll(async function () {
    if (browser) await browser.close();
});