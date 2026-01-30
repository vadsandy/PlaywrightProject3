pipeline {
    agent any
    
    // 1. Environment variables help Playwright/SQL find your credentials
   environment {
        // Secrets from Jenkins Credentials Provider
        DB_USER = credentials('DB_USER_ID') 
        DB_PASS = credentials('DB_PASSWORD_SECRET')
        
        // These are the missing pieces usually found in your .env file
        // Update these values to match your actual database details
        DB_HOST = 'localhost' // or your server IP
        DB_NAME = 'PlaywrightTestData'
        DB_PORT = '1433' 
        
        TARGET_ENV = "${params.ENVIRONMENT}"
    }
    
    parameters {
        choice(name: 'ENVIRONMENT', choices: ['QA', 'Staging', 'Production'], description: 'Pick Target Environment')
        string(name: 'TEST_TAG', defaultValue: '@UI', description: 'Filter tests by tag')
        // Note: SELECTED_FEATURES is managed by the Active Choices Plugin in the Jenkins UI
    }

    stages {
        stage('Cleanup') {
            steps {
                // 2. Wipe old results so the report only shows the current run
                bat 'if exist allure-results del /q allure-results\\*'
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
                bat 'npx playwright install --with-deps'
            }
        }

        stage('Execute Tests') {
            steps {
                script {
                    def runTarget = ""
                    // Handle feature selection from checkboxes
                    if (params.SELECTED_FEATURES && params.SELECTED_FEATURES.trim() != "") {
                        runTarget = params.SELECTED_FEATURES.split(',').collect { "src/features/${it.trim()}" }.join(' ')
                    } else {
                        runTarget = "src/features/"
                    }
                    
                    echo "Running tests for: ${runTarget} on ${env.TARGET_ENV}"
                    
                    // 3. The 'bat' command will now use the DB_USER/DB_PASS from the environment block above
                    bat "npx cucumber-js ${runTarget} --tags ${params.TEST_TAG}"
                }
            }
        }
    }

    post {
        always {
            // 4. Generate the Allure report from the results directory
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
        }
    }
}