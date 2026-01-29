const { Before, After, BeforeAll, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, request } = require('@playwright/test'); // Added 'request' here
const fs = require('fs');


// Global timeout for the entire step
setDefaultTimeout(60000); 

let browser;

BeforeAll(async function () {
    // Check if we are running in GitHub Actions to set headless mode
    const isCI = process.env.GITHUB_ACTIONS === 'true';
    browser = await chromium.launch({ 
        headless: isCI,
        args: ['--start-maximized'] 
    });
});

Before(async function (scenario) {
    const tags = scenario.pickle.tags.map(t => t.name);
    
    if (tags.includes('@API')) {
        this.apiRequest = await request.newContext({
            baseURL: 'https://demoqa.com'
        });
    } else {
        const env = process.env.TARGET_ENV || 'QA';
        let url;

        switch(env) {
            case 'Staging': url = 'https://staging.demoqa.com'; break;
            case 'Production': url = 'https://demoqa.com'; break;
            default: url = 'https://demoqa.com';
        }

        // ONE unified context creation with video enabled
        this.context = await browser.newContext({ 
            viewport: null,
            recordVideo: { dir: 'videos/' } 
        });
        
        this.page = await this.context.newPage();
        this.page.setDefaultTimeout(45000);
        this.baseUrl = url;
    }
});

After(async function (scenario) {
    // Only try to take a screenshot if a browser page exists (UI tests)
    if (scenario.result?.status === 'FAILED' && this.page) {
        // Screenshot
        const screenshot = await this.page.screenshot({ fullPage: true });
        this.attach(screenshot, 'image/png');

        // Video
        const videoPath = await this.page.video().path();
        this.attach(fs.readFileSync(videoPath), 'video/webm');

        // 2. Add "Create Issue" Link to Allure
        // Replace 'your-username' and 'your-repo' with your actual GitHub details
        const repoUrl = "https://github.com/vadsandy/PlaywrightProject3/issues/new";
        const title = encodeURIComponent(`Bug: ${scenario.pickle.name} failed`);
        const body = encodeURIComponent(`The test '${scenario.pickle.name}' failed in the ${process.env.TARGET_ENV || 'QA'} environment.`);
        
        const issueUrl = `${repoUrl}?title=${title}&body=${body}`;
        
        // This attaches a clickable link in the Allure report
        this.attach(`[Click here to report this bug on GitHub](${issueUrl})`, 'text/markdown');
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