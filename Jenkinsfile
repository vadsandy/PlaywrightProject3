pipeline {
    agent any
    
    environment {
        // Switch back to secure credentials now that we know the server path is right
        DB_USER = credentials('DB_USER_ID') 
        DB_PASS = credentials('DB_PASSWORD_SECRET')
        
        // These are static for your local machine
        DB_SERVER = 'localhost' // Use 'localhost' or '127.0.0.1'
        DB_NAME = 'PlaywrightTestData'
        DB_PORT = '1433'
        BASE_URL = 'https://demoqa.com'
        
        TARGET_ENV = "${params.ENVIRONMENT}"
    }
    
    parameters {
        choice(name: 'ENVIRONMENT', choices: ['QA', 'Staging', 'Production'], description: 'Environment')
        choice(name: 'TEST_TAG', choices: ['@UI', '@EXCEL', '@JSON', '@SQL'], description: 'Test Tag')
    }

    stages {
        stage('Cleanup') {
            steps {
                bat 'if exist allure-results del /q allure-results\\*'
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
                    def runTarget = (params.SELECTED_FEATURES && params.SELECTED_FEATURES.trim() != "") ? 
                                    params.SELECTED_FEATURES.split(',').collect { "src/features/${it.trim()}" }.join(' ') : 
                                    "src/features/"
                    
                    echo "Running tests with credentials on ${env.DB_SERVER}"
                    bat "npx cucumber-js ${runTarget} --tags ${params.TEST_TAG}"
                }
            }
        }
    }

    post {
        always {
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
        }
    }
}