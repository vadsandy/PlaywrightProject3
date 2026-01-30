pipeline {
    agent any
    
    environment {
        // Hardcoding values to bypass the Jenkins Credentials provider for debugging
        DB_USER = 'sa'
        DB_PASS = 'AutomationTesting'
        DB_SERVER = 'localhost'
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
                    // Logic to handle feature selection
                    def runTarget = (params.SELECTED_FEATURES && params.SELECTED_FEATURES.trim() != "") ? 
                                    params.SELECTED_FEATURES.split(',').collect { "src/features/${it.trim()}" }.join(' ') : 
                                    "src/features/"
                    
                    echo "Executing with Hardcoded Credentials on ${env.DB_SERVER}"
                    
                    // The 'bat' command will use the environment variables defined at the top
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