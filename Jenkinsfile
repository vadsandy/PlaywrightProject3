pipeline {
    agent any
    
    options {
        timeout(time: 15, unit: 'MINUTES') 
        // Removed ansiColor as the plugin is missing in your Jenkins setup
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
        choice(name: 'ENVIRONMENT', choices: ['QA', 'Staging', 'Production'])
        choice(name: 'TEST_TAG', choices: ['@UI', '@SQL', '@JSON', '@EXCEL', '@Negative'])
    }

    stages {
        stage('Cleanup') {
            steps {
                bat 'if exist allure-results del /q allure-results\\*'
                bat 'if exist reports del /q reports\\*'
                bat 'if not exist reports mkdir reports'
            }
        }

        stage('Install') {
            steps {
                bat 'npm install'
                // Skiping 'playwright install' as it's already on your local machine
            }
        }

        stage('Execute') {
            steps {
                script {
                    // This points to your new negative test feature file
                    def runTarget = "src/features/login_negative.feature"
                    
                    echo "Executing ${runTarget} with tag ${params.TEST_TAG}"
                    
                    // Generating junit.xml for the Test Results Analyzer
                    bat "npx cucumber-js ${runTarget} --tags ${params.TEST_TAG} --format junit:reports/junit.xml"
                }
            }
        }
    }

    post {
        always {
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            junit testResults: 'reports/junit.xml', allowEmptyResults: true
        }
    }
}