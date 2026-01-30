pipeline {
    agent any
    
    environment {
        // Database credentials from Jenkins Vault
        DB_USER = credentials('DB_USER_ID') 
        DB_PASS = credentials('DB_PASSWORD_SECRET')
        
        // Exact DB details provided by you
        DB_SERVER = 'localhost'
        DB_NAME = 'PlaywrightTestData'
        DB_PORT = '1433'
        BASE_URL = 'https://demoqa.com'
        
        TARGET_ENV = "${params.ENVIRONMENT}"
    }
    
    parameters {
        // Dropdown for Environment
        choice(name: 'ENVIRONMENT', 
               choices: ['QA', 'Staging', 'Production'], 
               description: 'Select the target environment')
        
        // Dropdown for Tags
        choice(name: 'TEST_TAG', 
               choices: ['@UI', '@EXCEL', '@JSON', '@SQL', '@API', '@Regression'], 
               description: 'Select the test category to execute')
        
        // SELECTED_FEATURES is handled by Active Choices in the Jenkins UI
    }

    stages {
        stage('Cleanup') {
            steps {
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
                    if (params.SELECTED_FEATURES && params.SELECTED_FEATURES.trim() != "") {
                        runTarget = params.SELECTED_FEATURES.split(',').collect { "src/features/${it.trim()}" }.join(' ')
                    } else {
                        runTarget = "src/features/"
                    }
                    
                    echo "Running tests for: ${runTarget} with tag ${params.TEST_TAG} on ${env.TARGET_ENV}"
                    
                    // The 'bat' command inherits the environment variables defined above
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