[![Playwright Regression Suite](https://github.com/vadsandy/PlaywrightProject3/actions/workflows/main.yml/badge.svg)](https://github.com/vadsandy/PlaywrightProject3/actions/workflows/main.yml)

# Playwright BDD Automation Framework

![Build Status](https://github.com/vadsandy/PlaywrightProject3/actions/workflows/main.yml/badge.svg)

This project is a BDD-style automation framework using **Playwright**, **Cucumber**, and **JavaScript**. It features automated reporting with Allure and integrated CI/CD via GitHub Actions.

## 📊 Test Reports
You can view the latest test results and historical trends here:
👉 [**Live Allure Report**](https://vadsandy.github.io/PlaywrightProject3/)

## 🚀 Framework Features
* **BDD Implementation**: Gherkin-based scenarios for better collaboration.
* **Multi-Source Data**: Supports JSON, Excel, and SQL Server data driven testing.
* **CI/CD Integration**: Automated runs on every push using GitHub Actions.
* **Historical Reporting**: Allure trends hosted on GitHub Pages.
* **Failure Capture**: Automatic screenshots attached to reports on test failure.

## 🛠️ Local Setup
1. Clone the repository.
2. Run `npm install`.
3. Create a `.env` file with your database credentials (see `.env.example`).
4. Execute tests:
   ```bash
   npx cucumber-js --tags "@UI"