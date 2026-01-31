pipeline {
    agent any
    
    environment {
        DB_USER = credentials('DB_USER_ID') 
        DB_PASS = credentials('DB_PASSWORD_SECRET')
        DB_SERVER = 'localhost'
        DB_NAME = 'PlaywrightTestData'
        DB_PORT = '1433'
        BASE_URL = 'https://demoqa.com'
    }
    
    parameters {
        choice(name: 'BRANCH_NAME', choices: ['main', 'dev', 'qa-branch'], description: 'Select branch to run')
        choice(name: 'ENVIRONMENT', choices: ['QA', 'Staging', 'Production'])
        choice(name: 'TEST_TAG', choices: ['@UI', '@SQL', '@JSON', '@EXCEL'])
        string(name: 'SELECTED_FEATURES', defaultValue: '', description: 'Comma separated feature files (e.g. login.feature, login_negative.feature)')
    }

    stages {
        
        stage('Cleanup') {
            bat 'if exist allure-results del /q allure-results\\*' 
            bat 'if not exist reports mkdir reports' // <--- ADD THIS LINE
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
                    
                    // UPDATE THIS LINE BELOW
                    bat "npx cucumber-js ${runTarget} --tags ${params.TEST_TAG} --format junit:reports/junit.xml"
                }
            }
        }
    }

    post {
        always {
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            // This is the "magic" line for the Test Results Analyzer
            junit testResults: 'reports/junit.xml', allowEmptyResults: true
        }
    }
}