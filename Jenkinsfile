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
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM', 
                    branches: [[name: "*/${params.BRANCH_NAME}"]], 
                    userRemoteConfigs: [[url: 'https://github.com/vadsandy/PlaywrightProject3.git', credentialsId: 'PlaywrightProject3']]
                ])
            }
        }
        stage('Cleanup') {
            steps { bat 'if exist allure-results del /q allure-results\\*' }
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
                    // Ensure the reports directory exists for the JUnit XML
                    bat 'if not exist reports mkdir reports' 
                    
                    bat "npx cucumber-js src/features/login_negative.feature --tags ${params.TEST_TAG} --format junit:reports/junit.xml"
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