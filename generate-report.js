const fs = require('fs-extra');
const { execSync } = require('child_process');

async function generateReport() {
    try {
        // 1. Check if a report already exists and has history
        if (fs.existsSync('./allure-report/history')) {
            console.log('--- Copying history from previous report ---');
            // Copy history into the new results folder
            await fs.copy('./allure-report/history', './allure-results/history');
        }

        // 2. Generate the new report
        console.log('--- Generating Allure Report ---');
        execSync('allure generate allure-results --clean -o allure-report', { stdio: 'inherit' });

        console.log('--- Report Generated successfully! ---');
    } catch (error) {
        console.error('Error generating report:', error);
    }
}

generateReport();