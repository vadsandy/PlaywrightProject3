pipeline {
    agent any
    
    options {
        timeout(time: 15, unit: 'MINUTES') // Prevents "hanging" builds
        ansiColor('xterm') // Makes console logs easier to read
    }

    environment {
        // Credentials matched to your image_73b33a.png
        DB_USER = credentials('DB_USER_ID') 
        DB_PASS = credentials('DB_PASSWORD_SECRET')
        
        DB_SERVER = 'localhost'
        DB_NAME = 'PlaywrightTestData'
        DB_PORT = '1433'
        BASE_URL = 'https://demoqa.com'
        TARGET_ENV = "${params.ENVIRONMENT}"
    }
    
    parameters {
        choice(name: 'ENVIRONMENT', choices: ['QA', 'Staging', 'Production'], description: 'Target Environment')
        choice(name: 'TEST_TAG', choices: ['@UI', '@SQL', '@JSON', '@EXCEL', '@API'], description: 'Category')
    }

    stages {
        stage('Cleanup') {
            steps {
                bat 'if exist allure-results del /q allure-results\\*'
            }
        }

        stage('Install') {
            steps {
                bat 'npm install'
                bat 'npx playwright install --with-deps'
            }
        }

        stage('Execute') {
            steps {
                script {
                    def runTarget = (params.SELECTED_FEATURES && params.SELECTED_FEATURES.trim() != "") ? 
                                    params.SELECTED_FEATURES.split(',').collect { "src/features/${it.trim()}" }.join(' ') : 
                                    "src/features/"
                    
                    // Runs the selected features and tags
                    bat "npx cucumber-js ${runTarget} --tags ${params.TEST_TAG}"
                }
            }
        }
    }

    post {
        always {
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            // This ensures the Test Results Analyzer has fresh data to pull
            junit '**/test-results/*.xml' // Only if your framework outputs JUnit XML
        }
    }
}