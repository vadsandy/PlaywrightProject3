pipeline {
    agent any
    
    options {
        timeout(time: 15, unit: 'MINUTES') 
        ansiColor('xterm')
    }

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
        choice(name: 'ENVIRONMENT', choices: ['QA', 'Staging', 'Production'], description: 'Target Environment')
        choice(name: 'TEST_TAG', choices: ['@UI', '@SQL', '@JSON', '@EXCEL', '@Negative'], description: 'Select Tag')
    }

    stages {
        stage('Cleanup') {
            steps {
                // Using double backslashes for Windows paths
                bat 'if exist allure-results del /q allure-results\\*'
                bat 'if exist reports del /q reports\\*'
                bat 'if not exist reports mkdir reports'
            }
        }

        stage('Install Dependencies') {
            steps {
                // 'npm install' updates packages; we skip 'playwright install' 
                // because browsers are already installed on your local Jenkins machine.
                bat 'npm install'
            }
        }

        stage('Execute Tests') {
            steps {
                script {
                    // This logic allows running the specific negative feature file 
                    // or all features if you use different tags.
                    def runTarget = "src/features/login_negative.feature"
                    
                    echo "Running tests on branch: ${params.BRANCH_NAME} with tag: ${params.TEST_TAG}"
                    
                    // The --format junit ensures the Test Results Analyzer gets data
                    bat "npx cucumber-js ${runTarget} --tags ${params.TEST_TAG} --format junit:reports/junit.xml"
                }
            }
        }
    }

    post {
        always {
            // Generate Allure Report
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            
            // Archive JUnit results for the Test Results Analyzer
            junit testResults: 'reports/junit.xml', allowEmptyResults: true
        }
    }
}